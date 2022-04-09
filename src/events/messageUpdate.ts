import { Message } from "discord.js";
import { removeInvites } from "../lib/message";

module.exports = {
  name: "messageUpdate",
  once: false,

  async execute(message: Message) {
    removeInvites(message);
  },
};
