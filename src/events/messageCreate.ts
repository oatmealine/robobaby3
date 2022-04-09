import { Message } from "discord.js";
import { removeInvites } from "../lib/message";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    removeInvites(message);
  },
};
