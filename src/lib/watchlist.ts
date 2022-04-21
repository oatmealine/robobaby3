import { Guild, GuildMember, Message, MessageEmbed, TextChannel, ThreadChannel } from "discord.js";
import { redis } from "./redis";

import * as dotenv from "dotenv";
dotenv.config();

const watchlist: any = {};

export async function loadWatchlist() {
  redis.keys("watchlist:*").then((keys) => {
    for (const key of keys) {
      redis.lRange(key, 0, -1).then((value) => {
        watchlist[key.replace("watchlist:", "")] = value;
      });
    }
  });

  console.log(`Loaded ${watchlist.length} users in the watchlist.`);
}

export async function getWatchlist(guild: Guild) {
  const list: Array<GuildMember> = [];
  const keys = Object.keys(watchlist);
  for (const key of keys) {
    const member = guild.members.cache.get(key.replace("watchlist:", ""));
    if (member) list.push(member);
  }
  return list;
}

export function addToWatchlist(guild: Guild, id: string): boolean {
  const member = guild.members.cache.get(id);
  const channel = getWatchlistChannel(guild);
  if (!member || !channel) return false;

  channel.threads
    .create({ name: member?.displayName as string, autoArchiveDuration: "MAX" })
    .then((thread) => {
      watchlist[id] = thread.id;
      redis.lPush(`watchlist:${member.id}`, thread.id);
    })
    .catch(console.log);

  return true;
}

export function removeFromWatchlist(guild: Guild, id: string) {
  redis.del(`watchlist:${id}`);
  delete watchlist[id];
}

export function checkWatchlist(message: Message) {
  if (!watchlist[message.author.id]) return;
  if (message.channel.id == process.env.SPAM_CHANNEL) return;
  if (!message.guild) return;

  const channel: ThreadChannel = message.client.channels.cache.get(watchlist[message.author.id]) as ThreadChannel;
  if (channel) {
    const embed = new MessageEmbed()
      .setDescription(`${message.channel}: ${message.content}`)
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setTimestamp(message.createdTimestamp)
      .setColor(message.member?.displayHexColor || "#000000");
    channel.send({ embeds: [embed] });
  }
}

function getWatchlistChannel(guild: Guild) {
  return guild.channels.cache.get(process.env.WATCHLIST_CHANNEL as string) as TextChannel;
}
