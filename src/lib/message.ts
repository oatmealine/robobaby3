import { Message, Permissions, Util } from "discord.js";
import { LogEvent } from "./log";
require("dotenv").config();

const cleverbot = require("cleverbot-free");

export const removeInvites = (message: Message) => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    LogEvent(`Invite link from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  }
};

export async function respondToMessage(message: Message) {
  await new Promise((r) => setTimeout(r, Math.random() * 5000 + 1000));
  message.channel.sendTyping();
  cleverbot(message.cleanContent)
    .then((res: string) => {
      res = res.toLowerCase();
      if (res.endsWith(".")) res = res.slice(0, -1);

      message.reply(res);
    })
    .catch(console.log);
}
