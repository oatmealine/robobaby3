import { GuildMember, MessageEmbed } from "discord.js";
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

export const GetMemberStatsEmbed = async (member: GuildMember): Promise<MessageEmbed> => {
  const embed = new MessageEmbed().setAuthor({ name: `${member.displayName}'s stats`, iconURL: member.user.displayAvatarURL() }).setColor(member.displayColor);
  for await (const [name, statData] of Object.entries(MemberStats)) {
    const stat = await GetMemberStat(member, name);
    if (statData.maxValue <= 7) {
      embed.addField(statData.name, `${(statData.icon || "🔵").repeat(stat)}${"▫️".repeat(statData.maxValue - stat)}`, true);
    } else {
      embed.addField(statData.name, `${stat}`, true);
    }
  }
  return embed;
};
