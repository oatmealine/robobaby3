import { Message } from "discord.js";
import { removeInvites } from "../lib/message";

import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: "messageUpdate",
  once: false,

  async execute(oldMessage: Message, newMessage: Message) {
    if (newMessage.author.bot || newMessage.member?.roles.cache.has(process.env.MOD_ROLE as string)) return;
    if (removeInvites(newMessage)) return;
  },
};
