import { Message } from "discord.js";
import { ReactToMessage } from "../lib/reactions";
import { FormatLuaCode, RemoveInvites } from "../lib/message";
import { RespondToMessage } from "../lib/responses";
import { CreateSpecialThreads } from "../lib/threadCreator";
import { RoboChat } from "../lib/roboChat";
import { Watchlist } from "../lib/watchlist";
import { HandleModMail } from "../lib/modMail";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    if (message.guildId === null) {
      HandleModMail(message);
      return;
    }

    if (RemoveInvites(message)) return;

    ReactToMessage(message);
    RespondToMessage(message);
    RoboChat(message);
    CreateSpecialThreads(message);
    FormatLuaCode(message);
    Watchlist.CheckMessage(message);
  },
};
