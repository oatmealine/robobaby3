import { GuildMember, MessageEmbed } from "discord.js";
import { MemberStats } from "./data/stats";
import { redis } from "./redis";

export const GetMemberStat = async (member: GuildMember, stat: string): Promise<number> => {
  return parseInt((await redis.get(`stats:${member.id}:${stat}`)) || `${MemberStats[stat].defaultValue}`);
};

export const SetMemberStat = async (member: GuildMember, stat: string, value: number) => {
  await redis.set(`stats:${member.id}:${stat}`, `${value}`);
  return stat;
};

export const AdjustMemberStat = async (member: GuildMember, stat: string, amount: number) => {
  let value = (await GetMemberStat(member, stat)) + amount;
  value = Math.max(Math.min(value, MemberStats[stat].maxValue), MemberStats[stat].minValue);
  return await SetMemberStat(member, stat, value);
};

export const GetMemberStatsEmbed = async (member: GuildMember, affectedStats?: Array<string>): Promise<MessageEmbed> => {
  const embed = new MessageEmbed().setAuthor({ name: `${member.displayName}'s stats`, iconURL: member.user.displayAvatarURL() }).setColor(member.displayColor);
  for await (const [name, statData] of Object.entries(MemberStats)) {
    const stat = await GetMemberStat(member, name);

    let statName = statData.name;
    let statValue = statData.maxValue < 20 ? `${statData.icon} ${stat} / ${statData.maxValue}` : `${statData.icon} x ${stat}`;
    if (affectedStats?.includes(name)) {
      statName = `⭐ ${statName} ⭐`;
      statValue = `**${statValue}**`;
    }
    embed.addField(statName, statValue, true);
  }
  return embed;
};
