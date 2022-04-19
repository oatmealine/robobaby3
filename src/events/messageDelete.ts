import { Message } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "messageDelete",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    LogEvent(`${message.author}'s message deleted in ${message.channel}:\n>>> ${message.content}`);
    console.log(`${message.author.tag}'s message deleted in ${message.channel}:\n${message.content}`);
  },
};
