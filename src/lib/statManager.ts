import { ButtonInteraction, Client, GuildMember, MessageEmbed } from "discord.js";
import { statData } from "./data/stats";
import { InteractiveElementManager } from "./interactiveElement";
import { redis } from "./redis";

export interface IStatChange {
  stat: string;
  value: number;
}

export class StatManager extends InteractiveElementManager {
  protected static elementName = "item";

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const member = await i.guild?.members.fetch(id);
    if (!member) return;

    const statsEmbed = await this.GetEmbed(member);
    i.reply({ embeds: [statsEmbed], ephemeral: true }).catch(console.log);
  }

  static async GetStat(member: GuildMember, stat: string): Promise<number> {
    return parseInt((await redis.get(`stats:${member.id}:${stat}`)) || `${statData[stat].defaultValue}`);
  }

  static async SetStat(member: GuildMember, stat: string, value: number): Promise<Array<IStatChange>> {
    const oldStat = await this.GetStat(member, stat);
    await redis.set(`stats:${member.id}:${stat}`, `${value}`);
    return value != oldStat ? [{ stat: stat, value: oldStat <= value ? 1 : -1 }] : [];
  }

  static async AdjustStat(member: GuildMember, stat: string, amount: number): Promise<Array<IStatChange>> {
    const origValue = await this.GetStat(member, stat);
    const value = Math.max(Math.min(origValue + amount, statData[stat].maxValue), statData[stat].minValue);
    await redis.set(`stats:${member.id}:${stat}`, `${value}`);
    return value != origValue ? [{ stat: stat, value: amount }] : [];
  }

  static async GetEmbed(member: GuildMember, stats?: string[]) {
    const embed = new MessageEmbed().setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL() }).setColor(member.displayColor);
    for await (const [name, data] of Object.entries(statData)) {
      if (stats && !stats.includes(name)) continue;
      const stat = await this.GetStat(member, name);

      const statValue = data.maxValue < 20 ? `${data.icon} **${stat}** / ${data.maxValue}` : `${data.icon} x **${stat}**`;
      embed.addField(data.name, statValue, true);
    }
    return embed;
  }
}

export const InitializeStats = async (client: Client) => {
  StatManager.Initialize(client, statData, [
    process.env.CHANNEL_CHAT as string,
    process.env.CHANNEL_CHESTS as string,
    process.env.CHANNEL_SECRET as string,
    process.env.CHANNEL_ERROR as string,
  ]);
};
