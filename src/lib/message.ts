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
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.mentions.users.has(message.client.user?.id || "")) return;

  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "what do you think of this?";

  let output: string = "i'm robo-baby";
  await cleverbot(input)
    .then((res: string) => {
      res = res.toLowerCase();
      if (res.endsWith(".")) res = res.slice(0, -1);
      output = res;
    })
    .catch(console.log);

  message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, Math.random() * 1000 + output.length * 50));

  message.reply(output);
}
