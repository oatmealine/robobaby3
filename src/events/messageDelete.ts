import { Message } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "messageDelete",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    LogEvent(`Message from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  },
};
