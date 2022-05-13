import { Guild, GuildMember, Message, MessageEmbed, TextChannel, ThreadChannel } from "discord.js";
import { redis } from "./redis";
import { botColor } from "./util";

export class Watchlist {
  static watchlist: { [key: string]: string } = {};

  static Load = async () => {
    redis.keys("watchlist:*").then(async (keys) => {
      for await (const key of keys) {
        await redis.get(key).then((value) => {
          this.watchlist[key.replace("watchlist:", "")] = value as string;
        });
      }
      console.log(`Loaded ${Object.keys(this.watchlist).length} users in the watchlist`);
    });
  };

  static GetMembers = (guild: Guild) => {
    const list: Array<GuildMember | string> = [];
    const keys = Object.keys(this.watchlist);
    for (const key of keys) {
      const id = key.replace("watchlist:", "");
      const member = guild.members.cache.get(id);
      list.push(member || id);
    }
    return list;
  };

  static AddMemberID = (guild: Guild, id: string): boolean => {
    const member = guild.members.cache.get(id);
    const channel = guild.channels.cache.get(process.env.CHANNEL_WATCHLIST as string) as TextChannel;
    if (!member || !channel) return false;

    channel.threads
      .create({ name: member?.displayName as string, autoArchiveDuration: "MAX" })
      .then((thread) => {
        this.watchlist[id] = thread.id;
        redis.set(`watchlist:${member.id}`, thread.id);
      })
      .catch(console.log);

    return true;
  };

  static RemoveMemberID = (guild: Guild, id: string) => {
    redis.del(`watchlist:${id}`);
    delete this.watchlist[id];
  };

  static CheckMessage = (message: Message) => {
    if (!this.watchlist[message.author.id]) return;
    if (!message.guild || message.channel.id === process.env.CHANNEL_CHAT) return;

    const channel: ThreadChannel = message.client.channels.cache.get(this.watchlist[message.author.id]) as ThreadChannel;
    if (channel) {
      const embed = new MessageEmbed()
        .setDescription(`${message.channel}: ${message.content}`)
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setTimestamp(message.createdTimestamp)
        .setColor(message.member?.displayHexColor || botColor);
      channel.send({ embeds: [embed] });
    }
  };
}
