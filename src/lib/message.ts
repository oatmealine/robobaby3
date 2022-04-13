import { Message, Permissions } from "discord.js";
import { getRandomEmoji } from "./util";
require("dotenv").config();

export const removeInvites = (message: Message): void => {
  //if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g)) {
    message.delete();
    message.member?.send(`Don't send invite links to other servers. If you must, send them to the interested parties directly. ${getRandomEmoji(message.guild)}`);
  }
};
