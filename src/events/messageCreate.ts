import { Message } from "discord.js";
import { reactToMessage } from "../lib/reactions";
import { removeInvites } from "../lib/message";
import { respondToMessage } from "../lib/responses";
import { createThreads } from "../lib/threadCreator";
import { roboChat } from "../lib/roboChat";
import { checkWatchlist } from "../lib/watchlist";

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
    checkWatchlist(message);
  },
};
