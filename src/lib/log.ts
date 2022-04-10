import { TextChannel } from "discord.js";
import { client } from "../bot";
require("dotenv").config();

export const LogEvent = (message: string) => {
  console.log(message);
  const channel = client.channels.cache.get(process.env.LOG_CHANNEL || "") as TextChannel;
  if (channel) {
    channel.send(message);
  }
};

export const ReportEvent = (message: string) => {
  console.log(message);
  const channel = client.channels.cache.get(process.env.MOD_CHANNEL || "") as TextChannel;
  if (channel) {
    channel.send(message);
  }
};
