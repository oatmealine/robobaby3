import { Message } from "discord.js";
import { LogEdits, RemoveInvites } from "../lib/message";

module.exports = {
  name: "messageUpdate",
  once: false,

  async execute(oldMessage: Message, newMessage: Message) {
    if (newMessage.author.bot || newMessage.member?.roles.cache.has(process.env.ROLE_MOD as string)) return;
    if (RemoveInvites(newMessage)) return;

    LogEdits(oldMessage, newMessage);
  },
};
