import { TextChannel } from "discord.js";
import { client } from "../bot";

export const LogEvent = (message: string) => {
  console.log(message);
  const channel = client.channels.cache.get("962046090927038474") as TextChannel;
  if (channel) {
    channel.send(message);
  }
};
