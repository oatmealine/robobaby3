import { Guild, Role, TextChannel } from "discord.js";
import { client } from "../bot";
require("dotenv").config();

export const LogEvent = (message: string): void => {
  const channel = client.channels.cache.get(process.env.LOG_CHANNEL || "") as TextChannel;
  if (channel) {
    channel.send(message);
  }
};

export const ReportEvent = (guild: Guild, message: string, ping: boolean = true): void => {
  const channel: TextChannel = client.channels.cache.get(process.env.MOD_CHANNEL || "") as TextChannel;
  const modRole: Role = guild.roles.cache.find((r) => r.name === "Moderator") as Role;

  if (channel && modRole) {
    if (ping) message = `${modRole}, ${message}`;
    channel.send(`${message}`);
  }
};
