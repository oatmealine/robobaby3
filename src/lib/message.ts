import { Message, Permissions } from "discord.js";
import { LogEvent } from "./log";

export const removeInvites = (message: Message) => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    LogEvent(`Invite link from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  }
};
