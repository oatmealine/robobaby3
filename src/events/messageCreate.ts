import { Message, Permissions } from "discord.js";
import { client } from "src/bot";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

    if (message.content.includes("discord.gg")) {
      message.delete();
      LogEvent(`Invite link from ${message.author} deleted in ${message.channel}:\n${message.content}`);
    }
  },
};
