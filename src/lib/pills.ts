import { GuildMember, TextChannel } from "discord.js";
import { redis } from "./redis";
import * as dotenv from "dotenv";
dotenv.config();

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
        if (c.type === "GUILD_TEXT" || c.type === "GUILD_VOICE") c.permissionOverwrites.create(member, { VIEW_CHANNEL: false }).catch(console.log);
      });
    }, 1000 * 2);
    setTimeout(async () => {
      member.guild.channels.cache.each((c) => {
        if (c.type === "GUILD_TEXT" || c.type === "GUILD_VOICE") c.permissionOverwrites.delete(member).catch(console.log);
      });
    }, duration + 2000);
  };

  static setNickname = (member: GuildMember, nick: string, duration: number) => {
    member
      .setNickname(nick)
      .then(() => {
        setTimeout(() => member.setNickname("").catch(console.log), duration);
      })
      .catch(console.log);
  };

  static giveRole = (member: GuildMember, roleName: string, duration: number) => {
    const role = member.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) return;

    member.roles
      .add(role)
      .then(() => {
        setTimeout(() => member.roles.remove(role).catch(console.log), duration);
      })
      .catch(console.log);
  };

  static resetCooldown = (member: GuildMember) => {
    redis.set(`pill:${member.id}`, "0");
  };
}
