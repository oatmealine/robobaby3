import { GuildMember, TextChannel } from "discord.js";
import { AdjustMemberStat, SetMemberStat } from "../memberStats";
import { GetRandomStat, MemberStats } from "./stats";

interface Pill {
  name: string;
  icon: string;
  effect?: (member: GuildMember) => Promise<void>;
}

export const pills: Array<Pill> = [
  {
    name: "48 Hour Energy",
    icon: "🔋",
  },
  {
    name: "Amnesia",
    icon: "❓",
    effect: async (m) => {
      setTimeout(async () => {
        m.guild.channels.cache.each(async (c) => {
          if (c.type === "GUILD_TEXT" || c.type == "GUILD_VOICE") c.permissionOverwrites.create(m, { VIEW_CHANNEL: false }).catch(console.log);
        });
      }, 1000 * 2);
      setTimeout(async () => {
        m.guild.channels.cache.each((c) => {
          if (c.type === "GUILD_TEXT" || c.type == "GUILD_VOICE") c.permissionOverwrites.delete(m).catch(console.log);
        });
      }, 1000 * 12);
    },
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
    icon: "😏",
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
    effect: async (m) => await AdjustMemberStat(m, "flies", 1),
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
    effect: async (m) => await AdjustMemberStat(m, "size", -1),
  },
  {
    name: "️One Makes You Larger",
    icon: "👨",
    effect: async (m) => await AdjustMemberStat(m, "size", 1),
  },
  {
    name: "Percs",
    icon: "💊",
  },
  {
    name: "Power Pill",
    icon: "🕹️",
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
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    effect: async (m) => await SetMemberStat(m, "hype", MemberStats["hype"].maxValue),
  },
  {
    name: "Gulp!",
    icon: "🍸",
  },
  {
    name: "Horf!",
    icon: "🧨",
  },
  {
    name: "I'm Drowsy...",
    icon: "😴",
    effect: async (m) => await AdjustMemberStat(m, "hype", -1),
  },
  {
    name: "I'm Excited!!!",
    icon: "😀",
    effect: async (m) => await AdjustMemberStat(m, "hype", 1),
  },
  {
    name: "Something's wrong...",
    icon: "😵‍💫",
  },
  {
    name: "Vurp!",
    icon: "😩",
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
      await AdjustMemberStat(m, GetRandomStat(), -1);
      await AdjustMemberStat(m, GetRandomStat(), 1);
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

const RevealChannel = (channelId: string, member: GuildMember, duration: number) => {
  const channel = member.guild.channels.cache.get(channelId) as TextChannel;
  if (!channel) return;

  channel.permissionOverwrites.edit(member, { VIEW_CHANNEL: true }).catch(console.log);
  setTimeout(() => {
    channel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false }).catch(console.log);
  }, duration);
};
