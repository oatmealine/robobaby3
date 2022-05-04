import { Guild, GuildMember, Message, MessageEmbed, TextChannel, ThreadChannel } from "discord.js";
import { redis } from "./redis";
import { botColor } from "./util";

import * as dotenv from "dotenv";
dotenv.config();

const watchlist: { [key: string]: string } = {};

export const loadWatchlist = async () => {
  redis.keys("watchlist:*").then(async (keys) => {
    for await (const key of keys) {
      await redis.get(key).then((value) => {
        watchlist[key.replace("watchlist:", "")] = value as string;
      });
    }
    console.log(`Loaded ${Object.keys(watchlist).length} users in the watchlist`);
  });
};

export const getWatchlist = (guild: Guild) => {
  const list: Array<GuildMember | string> = [];
  const keys = Object.keys(watchlist);
  for (const key of keys) {
    const id = key.replace("watchlist:", "");
    const member = guild.members.cache.get(id);
    list.push(member || id);
  }
  return list;
};

export const addToWatchlist = (guild: Guild, id: string): boolean => {
  const member = guild.members.cache.get(id);
  const channel = guild.channels.cache.get(process.env.CHANNEL_WATCHLIST as string) as TextChannel;
  if (!member || !channel) return false;

  channel.threads
    .create({ name: member?.displayName as string, autoArchiveDuration: "MAX" })
    .then((thread) => {
      watchlist[id] = thread.id;
      redis.set(`watchlist:${member.id}`, thread.id);
    })
    .catch(console.log);

  return true;
};

export const removeFromWatchlist = (guild: Guild, id: string) => {
  redis.del(`watchlist:${id}`);
  delete watchlist[id];
};

export const checkWatchlist = (message: Message) => {
  if (!watchlist[message.author.id]) return;
  if (!message.guild || message.channel.id == process.env.CHANNEL_CHAT) return;

  const channel: ThreadChannel = message.client.channels.cache.get(watchlist[message.author.id]) as ThreadChannel;
  if (channel) {
    const embed = new MessageEmbed()
      .setDescription(`${message.channel}: ${message.content}`)
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setTimestamp(message.createdTimestamp)
      .setColor(message.member?.displayHexColor || botColor);
    channel.send({ embeds: [embed] });
  }
};
