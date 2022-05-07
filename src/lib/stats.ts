import { GuildMember } from "discord.js";
import { MemberStats } from "./data/stats";
import { redis } from "./redis";

export const GetMemberStat = async (member: GuildMember, stat: string): Promise<number> => {
  return parseInt((await redis.get(`${member.id}:${stat}`)) || `${MemberStats[stat].defaultValue}`);
};

export const SetMemberStat = async (member: GuildMember, stat: string, value: number) => {
  await redis.set(`${member.id}:${stat}`, `${value}`);
};

export const AdjustMemberStat = async (member: GuildMember, stat: string, amount: number) => {
  let value = (await GetMemberStat(member, stat)) + amount;
  value = Math.max(Math.min(value, MemberStats[stat].maxValue), MemberStats[stat].minValue);
  await SetMemberStat(member, stat, value);
};
