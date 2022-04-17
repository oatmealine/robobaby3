import { Guild, GuildMember, Message, TextChannel } from "discord.js";

import db from "quick.db";
import * as dotenv from "dotenv";
dotenv.config();

let watchlist: Array<string> = [];

export async function loadWatchlist() {
  watchlist = (await db.get("watchlist.list")) || [];
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
  db.set("watchlist.list", watchlist);

  return true;
}

export function removeFromWatchlist(id: string): boolean {
  if (!watchlist.includes(id)) return false;
  watchlist.splice(watchlist.indexOf(id), 1);
  db.set("watchlist.list", watchlist);

  return true;
}

export function checkWatchlist(message: Message) {
  if (!watchlist.includes(message.author.id)) return;
  if (message.channel.id == process.env.SPAM_CHANNEL) return;
  if (!message.guild) return;

  const channel: TextChannel = message.client.channels.cache.get(
    process.env.WATCHLIST_CHANNEL as string
  ) as TextChannel;
  if (channel)
    channel.send(
      `${message.author} posted in ${message.channel}:\n>>> ${message.content}`
    );
}
