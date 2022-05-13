import { Client, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { MemberStats } from "./data/stats";
import { redis } from "./redis";

export interface StatChange {
  stat: string;
  value: number;
}

export const createStatButtonCollector = (client: Client): void => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  const collector = channel?.createMessageComponentCollector({ filter: (i) => Number.isInteger(parseInt(i.customId)) });
  collector?.on("collect", async (i) => {
    const member = await i.guild?.members.fetch(i.customId);
    if (!member) return;
    const statsEmbed = await GetMemberStatsEmbed(member);
    i.reply({ embeds: [statsEmbed], ephemeral: true }).catch(console.log);
  });
};

export const GetMemberStat = async (member: GuildMember, stat: string): Promise<number> => {
  return parseInt((await redis.get(`stats:${member.id}:${stat}`)) || `${MemberStats[stat].defaultValue}`);
};

export const SetMemberStat = async (member: GuildMember, stat: string, value: number): Promise<Array<StatChange>> => {
  const oldStat = await GetMemberStat(member, stat);
  await redis.set(`stats:${member.id}:${stat}`, `${value}`);
  return value != oldStat ? [{ stat: stat, value: oldStat <= value ? 1 : -1 }] : [];
};

export const AdjustMemberStat = async (member: GuildMember, stat: string, amount: number): Promise<Array<StatChange>> => {
  const origValue = await GetMemberStat(member, stat);
  const value = Math.max(Math.min(origValue + amount, MemberStats[stat].maxValue), MemberStats[stat].minValue);
  await redis.set(`stats:${member.id}:${stat}`, `${value}`);
  return value != origValue ? [{ stat: stat, value: amount }] : [];
};

export const GetMemberStatsEmbed = async (member: GuildMember, stats?: Array<string>): Promise<MessageEmbed> => {
  const embed = new MessageEmbed().setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL() }).setColor(member.displayColor);
  for await (const [name, statData] of Object.entries(MemberStats)) {
    if (stats && !stats.includes(name)) continue;
    const stat = await GetMemberStat(member, name);

    const statValue = statData.maxValue < 20 ? `${statData.icon} **${stat}** / ${statData.maxValue}` : `${statData.icon} x **${stat}**`;
    embed.addField(statData.name, statValue, true);
  }
  return embed;
};

export const GetMemberItems = async (member: GuildMember) => {
  const itemsKey = `items:${member.id}`;
  const memberItems = await redis.lRange(itemsKey, 0, -1);
  return memberItems;
};
