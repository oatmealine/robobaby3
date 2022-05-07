import { GuildMember, TextChannel } from "discord.js";
import { AdjustMemberStat, SetMemberStat } from "../memberStats";
import { redis } from "../redis";
import { GetRandomStatName, MemberStats } from "./stats";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tinytext = require("tiny-text");

interface Pill {
  name: string;
  icon: string;
  effect?: (member: GuildMember) => Promise<unknown>;
}

export const pills: Array<Pill> = [
  {
    name: "48 Hour Energy",
    icon: "🔋",
  },
  {
    name: "Amnesia",
    icon: "❓",
    effect: async (m) => HideAllChannels(m, 1000 * 10),
  },
  {
    name: "Bad Gas",
    icon: "💨",
  },
  {
    name: "Bad Trip",
    icon: "😈",
    effect: async (m) => await AdjustMemberStat(m, "health", -1),
  },
  {
    name: "Balls of Steel",
    icon: "💙",
    effect: async (m) => await AdjustMemberStat(m, "health", 2),
  },
  {
    name: "Bombs Are Key",
    icon: "💣🔑",
  },
  {
    name: "Explosive Diarrhea",
    icon: "💩💥",
    effect: async (m) => await AdjustMemberStat(m, "poop", 5),
  },
  {
    name: "Full Health",
    icon: "💖",
    effect: async (m) => await SetMemberStat(m, "health", MemberStats["health"].maxValue),
  },
  {
    name: "Health Down",
    icon: "❤️⬇️",
    effect: async (m) => await AdjustMemberStat(m, "health", -1),
  },
  {
    name: "Health Up",
    icon: "❤️⬆️",
    effect: async (m) => await AdjustMemberStat(m, "health", 1),
  },
  {
    name: "Hematemesis",
    icon: "💕",
    effect: async (m) => await SetMemberStat(m, "health", 1),
  },
  {
    name: "I Can See Forever",
    icon: "👀",
    effect: async (m) => RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 60),
  },
  {
    name: "I Found Pills",
    icon: "🥴",
    effect: async (m) => SetNickname(m, "🥴", 1000 * 60 * 10),
  },
  {
    name: "Lemon Party",
    icon: "🍋",
  },
  {
    name: "Luck Down",
    icon: "🍀⬇️",
    effect: async (m) => await AdjustMemberStat(m, "luck", -1),
  },
  {
    name: "Luck Up",
    icon: "🍀⬆️",
    effect: async (m) => await AdjustMemberStat(m, "luck", 1),
  },
  {
    name: "Paralysis",
    icon: "😐",
    effect: async (m) => m.timeout(1000 * 30),
  },
  {
    name: "Pheromones",
    icon: "👃",
  },
  {
    name: "Puberty",
    icon: "👦",
    effect: async (m) => await AdjustMemberStat(m, "age", 1),
  },
  {
    name: "Pretty Fly",
    icon: "🪰",
    effect: async (m) => await AdjustMemberStat(m, "prettyFlies", 1),
  },
  {
    name: "Range Down",
    icon: "🎯⬇️",
    effect: async (m) => await AdjustMemberStat(m, "luck", -1),
  },
  {
    name: "Range Up",
    icon: "🎯⬆️",
    effect: async (m) => await AdjustMemberStat(m, "luck", 1),
  },
  {
    name: "R U a Wizard?",
    icon: "🧙‍♂️",
  },
  {
    name: "Speed Down",
    icon: "👢⬇️",
    effect: async (m) => await AdjustMemberStat(m, "speed", -1),
  },
  {
    name: "Speed Up",
    icon: "👢⬆️",
    effect: async (m) => await AdjustMemberStat(m, "speed", 1),
  },
  {
    name: "Tears Down",
    icon: "😭⬇️",
    effect: async (m) => await AdjustMemberStat(m, "tears", -1),
  },
  {
    name: "Tears Up",
    icon: "😭⬆️",
    effect: async (m) => await AdjustMemberStat(m, "tears", 1),
  },
  {
    name: "Telepills",
    icon: "🌟",
    effect: async (m) => RevealChannel(process.env.CHANNEL_ERROR as string, m, 1000 * 60),
  },
  {
    name: "Addicted",
    icon: "🍺",
  },
  {
    name: "Friends Till The End!",
    icon: "🙏",
    effect: async (m) => await AdjustMemberStat(m, "flies", 12),
  },
  {
    name: "Infested!",
    icon: "🕷️",
    effect: async (m) => await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 8)),
  },
  {
    name: "Infested?",
    icon: "🕸️",
    effect: async (m) => await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 3)),
  },
  {
    name: "One Makes You Small",
    icon: "👶",
    effect: async (m) => {
      SetNickname(m, `${tinytext(m.displayName)}`, 1000 * 60 * 10);
      return await AdjustMemberStat(m, "size", -1);
    },
  },
  {
    name: "️One Makes You Larger",
    icon: "👨",
    effect: async (m) => {
      SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10);
      return await AdjustMemberStat(m, "size", 1);
    },
  },
  {
    name: "Percs",
    icon: "💊",
  },
  {
    name: "Power Pill",
    icon: "🕹️",
    effect: async (m) => SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10),
  },
  {
    name: "Re-Lax",
    icon: "💩",
    effect: async (m) => await AdjustMemberStat(m, "poop", 5),
  },
  {
    name: "Retro Vision",
    icon: "👾",
    effect: async (m) => RevealChannel(process.env.CHANNEL_LEGACY as string, m, 1000 * 60 * 5),
  },
  {
    name: "???",
    icon: "🌽",
    effect: async (m) => {
      HideAllChannels(m, 1000 * 30);
      setTimeout(() => RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 30), 1000 * 2);
    },
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    effect: async (m) => await SetMemberStat(m, "hype", MemberStats["hype"].maxValue),
  },
  {
    name: "Gulp!",
    icon: "🍸",
    effect: async (m) => await AdjustMemberStat(m, GetRandomStatName(true), 1),
  },
  {
    name: "Horf!",
    icon: "🧨",
    effect: async (m) => await AdjustMemberStat(m, "damage", 1),
  },
  {
    name: "I'm Drowsy...",
    icon: "😴",
    effect: async (m) => {
      m.timeout(1000 * 30);
      return await AdjustMemberStat(m, "hype", -1);
    },
  },
  {
    name: "I'm Excited!!!",
    icon: "😀",
    effect: async (m) => await AdjustMemberStat(m, "hype", 1),
  },
  {
    name: "Something's wrong...",
    icon: "😵‍💫",
    effect: async (m) => await AdjustMemberStat(m, "poop", 2),
  },
  {
    name: "Vurp!",
    icon: "😩",
    effect: async (m) => redis.set(`pill:${m.id}`, "0"),
  },
  {
    name: "X-Lax",
    icon: "💩",
    effect: async (m) => await AdjustMemberStat(m, "poop", 5),
  },
  {
    name: "Experimental Pill",
    icon: "😷",
    effect: async (m) => {
      const stat1 = GetRandomStatName(true);
      const stat2 = GetRandomStatName(true);
      await AdjustMemberStat(m, stat1, -1);
      await AdjustMemberStat(m, stat2, 1);
      return [stat1, stat2];
    },
  },
  {
    name: "Shot Speed Down",
    icon: "🚿⬇️",
    effect: async (m) => await AdjustMemberStat(m, "shotSpeed", -1),
  },
  {
    name: "Shot Speed Up",
    icon: "🚿⬆️",
    effect: async (m) => await AdjustMemberStat(m, "shotSpeed", 1),
  },
];

export const GetRandomPill = (): Pill => {
  return pills[Math.floor(Math.random() * pills.length)];
};

const RevealChannel = async (channelId: string, member: GuildMember, duration: number) => {
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

const HideAllChannels = (member: GuildMember, duration: number) => {
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

const SetNickname = (member: GuildMember, nick: string, duration: number) => {
  member.setNickname(nick).catch(console.log);
  setTimeout(() => member.setNickname("").catch(console.log), duration);
};
