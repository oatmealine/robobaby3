import { Client, GuildMember, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { GetMemberStatsEmbed } from "./memberStats";
import { redis } from "./redis";
dotenv.config();

export const createPillStatCollector = (client: Client): void => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  const collector = channel?.createMessageComponentCollector({ filter: (i) => Number.isInteger(parseInt(i.customId)) });
  collector?.on("collect", async (i) => {
    const member = i.guild?.members.cache.get(i.customId);
    if (!member) return;
    const statsEmbed = await GetMemberStatsEmbed(member);
    i.reply({ embeds: [statsEmbed], ephemeral: true }).catch(console.log);
  });
};

export class PillEffects {
  static revealChannel = async (channelId: string, member: GuildMember, duration: number) => {
    const channel = member.guild.channels.cache.get(channelId) as TextChannel;
    if (!channel) return;
    await channel.permissionOverwrites.edit(member, { VIEW_CHANNEL: true }).catch(console.log);
    channel.send(`${member}`).then((msg) => {
      msg.delete().catch(console.log);
    });
    setTimeout(() => {
      channel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false }).catch(console.log);
    }, duration);
  };

  static hideAllChannels = (member: GuildMember, duration: number) => {
    setTimeout(async () => {
      member.guild.channels.cache.each(async (c) => {
        if (c.type === "GUILD_TEXT" || c.type == "GUILD_VOICE") c.permissionOverwrites.create(member, { VIEW_CHANNEL: false }).catch(console.log);
      });
    }, 1000 * 2);
    setTimeout(async () => {
      member.guild.channels.cache.each((c) => {
        if (c.type === "GUILD_TEXT" || c.type == "GUILD_VOICE") c.permissionOverwrites.delete(member).catch(console.log);
      });
    }, duration + 2000);
  };

  static setNickname = (member: GuildMember, nick: string, duration: number) => {
    member.setNickname(nick).catch(console.log);
    setTimeout(() => member.setNickname("").catch(console.log), duration);
  };

  static giveRole = (member: GuildMember, roleName: string, duration: number) => {
    const role = member.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) return;

    member.roles.add(role).catch(console.log);
    setTimeout(() => member.roles.remove(role).catch(console.log), duration);
  };

  static resetCooldown = (member: GuildMember) => {
    redis.set(`pill:${member.id}`, "0");
  };
}
