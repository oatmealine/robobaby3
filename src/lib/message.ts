import { Message, Permissions, TextChannel, User } from "discord.js";
import { delay, getRandomEmoji } from "./util";
import { LogEvent } from "./log";

import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require("diff");

export const sendMessage = async (location: TextChannel | Message | User, content: string, maxThinkDuration = 0): Promise<Message> => {
  await delay((Math.random() * maxThinkDuration) / 2 + maxThinkDuration / 2);

  if (location instanceof TextChannel) location.sendTyping();
  else if (location instanceof Message) location.channel.sendTyping();

  await delay(Math.random() * 500 + content.length * 15);

  if (location instanceof Message) {
    const msg = await location.reply(content);
    return msg;
  } else {
    const msg = await location.send(content);
    return msg;
  }
};

export const removeInvites = (message: Message): boolean => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return false;

  if (message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g)) {
    message.delete().catch(console.log);
    sendMessage(
      message.author,
      `Don't send invite links to other servers. If you must, send them to the interested parties directly. ${getRandomEmoji(message.guild)}`
    ).catch(console.log);
    return true;
  }
  return false;
};

export const logEdits = (oldMessage: Message, newMessage: Message) => {
  const diff = Diff.diffWords(oldMessage.content.replace(/`/g, ""), newMessage.content.replace(/`/g, ""));
  let output = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diff.forEach((part: any) => {
    output += "\n";
    if (part.added) output += "+ ";
    if (part.removed) output += "- ";
    output += part.value;
  });
  const diffMsg = `\`\`\`diff\n${output}\`\`\``;

  LogEvent(`${newMessage.author}'s message edited in ${newMessage.channel}:${diffMsg}`);
  console.log(`${newMessage.author.tag}'s message edited in ${newMessage.channel}`);
};
