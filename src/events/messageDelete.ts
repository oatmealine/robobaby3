import { Message } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "messageDelete",
  once: false,

  async execute(message: Message) {
    if (message.author.bot || message.member?.roles.cache.has(process.env.ROLE_MOD as string)) return;

    LogEvent(`${message.author}'s message deleted in ${message.channel}:\n>>> ${message.content}`);
  },
};
