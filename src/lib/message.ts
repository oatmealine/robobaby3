import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, Permissions, TextChannel, User } from "discord.js";
import { botColor, Delay, GetRandomEmoji } from "./util";
import { LogEvent } from "./log";
import { formatText } from "lua-fmt";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const levenshtein = require("damerau-levenshtein");

import * as dotenv from "dotenv";
import { redis } from "./redis";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require("diff");

export const SendMessage = async (location: TextChannel | Message | User, content: string, maxThinkDuration = 0): Promise<Message> => {
  await Delay((Math.random() * maxThinkDuration) / 2 + maxThinkDuration / 2);

  if (location instanceof TextChannel) location.sendTyping();
  else if (location instanceof Message) location.channel.sendTyping();

  await Delay(Math.random() * 500 + content.length * 15);

  if (location instanceof Message) {
    const msg = await location.reply(content);
    return msg;
  } else {
    const msg = await location.send(content);
    return msg;
  }
};

export const RemoveInvites = (message: Message): boolean => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return false;

  if (message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g)) {
    message.delete().catch(console.log);
    SendMessage(
      message.author,
      `Don't send invite links to other servers. If you must, send them to the interested parties directly. ${GetRandomEmoji(message.guild)}`
    ).catch(console.log);
    return true;
  }
  return false;
};

export const LogEdits = (oldMessage: Message, newMessage: Message) => {
  if (oldMessage.content === newMessage.content) return;

  const diff = Diff.diffWords(oldMessage.content.replace(/`/g, ""), newMessage.content.replace(/`/g, ""));
  let output = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diff.forEach((part: any) => {
    if (part.added) output += `[2;32m[1;32m${part.value}[0m`;
    if (part.removed) output += `[2;41m[1;2m${part.value}[0m`;
    if (!part.added && !part.removed) output += part.value;
  });
  const diffMsg = `\`\`\`ansi\n${output}\`\`\``;

  LogEvent(`${newMessage.author}'s message edited in ${newMessage.channel}:${diffMsg}`);
};

const formatDeleteButtonDuration = 1000 * 30;

export const FormatLuaCode = async (message: Message): Promise<boolean> => {
  if ((await redis.get(`formattingDisabled:${message.author.id}`)) == "1") return false;

  const matches: string[] = [];
  const regex = /```lua\s([^`]+)```/g;
  let match;

  while ((match = regex.exec(message.content)) !== null) {
    const code = match[1];
    if (code.includes("\n") && code.length > 20) matches.push(code);
  }
  if (matches.length === 0) return false;

  let formatted = null;
  try {
    formatted = matches
      // run lua-fmt
      .map((t) => [t, formatText(t)])
      // only if it has been changed enough
      .filter(([old, formatted]) => levenshtein(old.trim(), formatted.trim()).relative > 0.1)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_old, formatted]) => `\`\`\`lua\n${formatted}\n\`\`\``);
  } catch (e) {
    console.log(e);
  }

  if (!formatted || formatted.length === 0) return false;

  const embed = new MessageEmbed()
    .setColor(botColor)
    .setDescription("_Auto-formatted code using [lua-fmt](https://github.com/trixnz/lua-fmt)_\n" + formatted.join("\n"));

  const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("delete").setLabel("Remove").setStyle("DANGER"));

  message
    .reply({
      embeds: [embed],
      components: [row],
    })
    .then((newMessage) => {
      const filter = (i: MessageComponentInteraction) => i.customId === "delete";

      const collector = newMessage.channel.createMessageComponentCollector({ filter, time: formatDeleteButtonDuration });
      setTimeout(() => newMessage.edit({ components: [] }).catch(console.log), formatDeleteButtonDuration);

      collector.on("collect", (i) => {
        if (i.user.id !== message.author.id) {
          i.reply({ content: "Only the original poster can delete this.", ephemeral: true });
          return;
        }

        newMessage.delete().catch(console.log);
        collector.stop();
      });
    })
    .catch(console.log);

  return true;
};
