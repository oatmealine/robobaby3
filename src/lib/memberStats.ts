import { GuildMember, MessageEmbed } from "discord.js";
import { MemberStats } from "./data/stats";
import { redis } from "./redis";

export interface StatChange {
  stat: string;
  value: number;
}

export const GetMemberStat = async (member: GuildMember, stat: string): Promise<number> => {
  return parseInt((await redis.get(`stats:${member.id}:${stat}`)) || `${MemberStats[stat].defaultValue}`);
};

export const SetMemberStat = async (member: GuildMember, stat: string, value: number): Promise<Array<StatChange>> => {
  const oldStat = await GetMemberStat(member, stat);
  await redis.set(`stats:${member.id}:${stat}`, `${value}`);
  return [{ stat: stat, value: oldStat <= value ? 1 : -1 }];
};

export const AdjustMemberStat = async (member: GuildMember, stat: string, amount: number): Promise<Array<StatChange>> => {
  let value = (await GetMemberStat(member, stat)) + amount;
  value = Math.max(Math.min(value, MemberStats[stat].maxValue), MemberStats[stat].minValue);
  await redis.set(`stats:${member.id}:${stat}`, `${value}`);
  return [{ stat: stat, value: amount }];
};

export const GetMemberStatsEmbed = async (member: GuildMember, affectedStats?: Array<StatChange>): Promise<MessageEmbed> => {
  const embed = new MessageEmbed().setAuthor({ name: `${member.displayName}'s stats`, iconURL: member.user.displayAvatarURL() }).setColor(member.displayColor);
  for await (const [name, statData] of Object.entries(MemberStats)) {
    const stat = await GetMemberStat(member, name);

    let statValue = statData.maxValue < 20 ? `${statData.icon} ${stat} / ${statData.maxValue}` : `${statData.icon} x ${stat}`;
    for (const change of affectedStats || []) {
      if (name == change.stat) statValue = `**${statValue}** ${change.value > 0 ? "🔺" : "🔻"}`;
    }
    embed.addField(statData.name, statValue, true);
  }
  return embed;
};
