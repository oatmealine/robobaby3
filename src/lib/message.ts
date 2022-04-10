import { Message, Permissions, Util } from "discord.js";
import { REPL_MODE_SLOPPY } from "repl";
import { LogEvent } from "./log";
import { delay } from "./util";
require("dotenv").config();

const cleverbot = require("cleverbot-free");

const defaultResponses = ["i'm robo-baby", "no", "what?", "can you repeat that?", "i don't understand", "🙂", "😏", "🤨"];
let lastResponse = 0;

export const removeInvites = (message: Message) => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    LogEvent(`Invite link from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  }
};

export async function respondToMessage(message: Message) {
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.mentions.users.has(message.client.user?.id || "")) return;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "what do you think of this?";
  input = input.trim();

  // query cleverbot
  let output: string = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  if (message.createdTimestamp - lastResponse > 2000) {
    await cleverbot(input)
      .then((res: string) => {
        output = res;
      })
      .catch(console.log);
    lastResponse = message.createdTimestamp;
  }

  // format output
  output = output.toLowerCase();
  if (output.endsWith(".") && !output.endsWith("...")) output = output.slice(0, -1);

  // start typing
  message.channel.sendTyping();
  await delay(Math.random() * 500 + 500 + output.length * 40);

  // respond
  message.reply(output);
}

export async function createThreads(message: Message) {
  // promotion
  if (message.channel.id == process.env.PROMO_CHANNEL) {
    if (message.embeds.length > 0) {
      const embed = message.embeds[0];
      if (!embed.title) return;

      if (embed.url?.includes("steamcommunity.com/workshop/filedetails/") || embed.url?.includes("steamcommunity.com/sharedfiles/filedetails/")) {
        message.startThread({ name: embed.title.replace("Steam Workshop::", ""), autoArchiveDuration: "MAX", reason: "Steam Workshop thread" }).catch(console.log);
      } else if (embed.url?.includes("moddingofisaac.com/mod/")) {
        message.startThread({ name: embed.title.replace(" - Modding of Isaac", ""), autoArchiveDuration: "MAX", reason: "Modding of Isaac thread" }).catch(console.log);
      }
    } else {
      await message
        .reply("Please post a link to a mod you've created on **Steam Workshop** or **Modding of Isaac**.")
        .then((reply: Message) => {
          return delay(10000).then(() => {
            message.delete();
            reply.delete();
          });
        })
        .catch(console.log);
    }
  }

  // recruit
  if (message.channel.id == process.env.RECRUIT_CHANNEL) {
    if (message.mentions.users.size == 0 && message.mentions.roles.size == 0 && message.content.length > 0) {
      let name: string = message.content;
      name = name.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, "");
      message.startThread({ name: name, autoArchiveDuration: "MAX" }).catch(console.log);
    } else {
      await message
        .reply("Please include a simple description and no mentions (links optional).")
        .then((reply: Message) => {
          return delay(10000).then(() => {
            message.delete();
            reply.delete();
          });
        })
        .catch(console.log);
    }
  }
}
