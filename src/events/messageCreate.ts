import { Message } from "discord.js";
import { reactToMessage } from "../lib/reactions";
import { createThreads, removeInvites, respondToMessage } from "../lib/message";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    removeInvites(message);
    reactToMessage(message);
    respondToMessage(message);
    createThreads(message);
  },
};
