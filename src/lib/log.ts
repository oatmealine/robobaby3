import { Guild, Message, MessageOptions, Role, TextChannel } from "discord.js";
import { client } from "../bot";

export const LogEvent = (message: string): void => {
  const channel = client.channels.cache.get(process.env.CHANNEL_LOG as string) as TextChannel;
  if (channel) channel.send(message).catch(console.log);
};

export const ReportEvent = async (guild: Guild, message: MessageOptions, ping = true): Promise<Message | null> => {
  const channel: TextChannel = client.channels.cache.get(process.env.CHANNEL_MOD as string) as TextChannel;
  const modRole: Role = guild.roles.cache.find((r) => r.id === process.env.ROLE_MOD) as Role;
  if (!channel || !modRole) return null;

  if (ping) message.content = `${modRole}, ${message.content}`;
  return channel.send(message);
};
