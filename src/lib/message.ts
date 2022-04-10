import { Message, Permissions, Util } from "discord.js";
import { LogEvent } from "./log";
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
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.cleanContent.toLowerCase().includes("robo")) return;

  // cooldown
  if (message.createdTimestamp - lastResponse < 2500) return;
  lastResponse = message.createdTimestamp;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "what do you think of this?";
  input = input.trim();

  // query cleverbot
  let output: string = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  await cleverbot(input)
    .then((res: string) => {
      output = res;
    })
    .catch(console.log);

  // format output
  output = output.toLowerCase();
  if (output.endsWith(".") && !output.endsWith("...")) output = output.slice(0, -1);

  // start typing
  message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, Math.random() * 500 + 500 + output.length * 40));

  // respond
  message.reply(output);
}
