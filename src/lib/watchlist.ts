import { Guild, GuildMember, Message, User } from "discord.js";
import { userInfo } from "os";
import { ReportEvent } from "./log";

const db = require("quick.db");

let watchlist: Array<string> = [];

export async function loadWatchlist() {
  watchlist = (await db.get("watchlist.list")) || [];
  console.log(`Loaded ${watchlist.length} users in the watchlist.`);
}

export async function getWatchlist(guild: Guild) {
  let list: Array<GuildMember> = [];
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

  console.log(watchlist);
  return true;
}

export function removeFromWatchlist(id: string): boolean {
  if (!watchlist.includes(id)) return false;
  watchlist.splice(watchlist.indexOf(id), 1);
  db.set("watchlist.list", watchlist);

  console.log(watchlist);
  return true;
}

export function checkWatchlist(message: Message) {
  if (!watchlist.includes(message.author.id)) return;
  if (!message.guild) return;

  ReportEvent(message.guild, `Watchlisted ${message.author} posted a message in ${message.channel}:\n>>> ${message.content}`);
}
