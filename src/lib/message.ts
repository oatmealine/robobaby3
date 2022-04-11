import { Message, Permissions } from "discord.js";
require("dotenv").config();

export const removeInvites = (message: Message): void => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    message.member?.send("Don't send invite links to other servers. If you must, send them to the interested users directly.");
  }
};
