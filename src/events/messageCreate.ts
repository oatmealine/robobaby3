import { Message } from "discord.js";
import { reactToMessage } from "../lib/reactions";
import { createThreads, removeInvites, roboChat } from "../lib/message";
import { respondToMessage } from "../lib/responses";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    removeInvites(message);
    reactToMessage(message);
    respondToMessage(message);
    roboChat(message);
    createThreads(message);
  },
};
