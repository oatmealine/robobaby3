import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";

import * as dotenv from "dotenv";
import { redis } from "./redis";
dotenv.config();

const watchlist: Array<string> = [];

export async function loadWatchlist() {
  const users = await redis.lRange("watchlist.users", 0, -1);
  users.forEach((id) => {
    watchlist.push(id);
  });
  console.log(`Loaded ${watchlist.length} users in the watchlist.`);
}

export async function getWatchlist(guild: Guild) {
  const list: Array<GuildMember> = [];
  await watchlist.forEach((id) => {
    const user = guild.members.cache.get(id);
    if (user) list.push(user);
  });
  return list;
}

export function addToWatchlist(id: string): boolean {
  if (watchlist.includes(id)) return false;
  watchlist.push(id);
  redis.lPush("watchlist.users", id);

  return true;
}

export function removeFromWatchlist(id: string): boolean {
  if (!watchlist.includes(id)) return false;
  watchlist.splice(watchlist.indexOf(id), 1);
  redis.lRem("watchlist.users", 0, id);

  return true;
}

export function checkWatchlist(message: Message) {
  if (!watchlist.includes(message.author.id)) return;
  if (message.channel.id == process.env.SPAM_CHANNEL) return;
  if (!message.guild) return;

  const channel: TextChannel = message.client.channels.cache.get(process.env.WATCHLIST_CHANNEL as string) as TextChannel;
  if (channel) {
    const embed = new MessageEmbed()
      .setDescription(`${message.channel}: ${message.content}`)
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setColor(message.member?.displayHexColor || "#000000");
    channel.send({ embeds: [embed] });
  }
}
