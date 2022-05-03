import { Guild, Message, MessageOptions, Role, TextChannel } from "discord.js";
import { client } from "../bot";

import * as dotenv from "dotenv";
dotenv.config();

export const LogEvent = (message: string): void => {
  const channel = client.channels.cache.get(process.env.CHANNEL_LOG || "") as TextChannel;
  if (channel) {
    channel.send(message).catch(console.log);
  }
};

export const ReportEvent = async (guild: Guild, message: MessageOptions, ping = true): Promise<Message | null> => {
  const channel: TextChannel = client.channels.cache.get(process.env.CHANNEL_MOD || "") as TextChannel;
  const modRole: Role = guild.roles.cache.find((r) => r.name === "Moderator") as Role;

  if (channel && modRole) {
    if (ping) message.content = `${modRole}, ${message.content}`;
    return channel.send(message);
  }
  return null;
};
