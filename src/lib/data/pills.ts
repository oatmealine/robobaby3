import { GuildMember } from "discord.js";
import { AdjustMemberStat } from "../stats";

interface Pill {
  name: string;
  icon: string;
  effect?: (member: GuildMember) => void;
}

export const pills: Array<Pill> = [
  {
    name: "48 Hour Energy",
    icon: "🔋",
  },
  {
    name: "Amnesia",
    icon: "❓",
  },
  {
    name: "Bad Gas",
    icon: "💨",
  },
  {
    name: "Bad Trip",
    icon: "😈",
  },
  {
    name: "Balls of Steel",
    icon: "💙",
  },
  {
    name: "Bombs Are Key",
    icon: "💣🔑",
  },
  {
    name: "Explosive Diarrhea",
    icon: "💩💥",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Full Health",
    icon: "💖",
  },
  {
    name: "Health Down",
    icon: "❤️⬇️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "health", -1);
    },
  },
  {
    name: "Health Up",
    icon: "❤️⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "health", 1);
    },
  },
  {
    name: "Hematemesis",
    icon: "💕",
  },
  {
    name: "I Can See Forever",
    icon: "👀",
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
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "luck", -1);
    },
  },
  {
    name: "Luck Up",
    icon: "🍀⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "luck", 1);
    },
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
  },
  {
    name: "Pretty Fly",
    icon: "🪰",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "flies", 1);
    },
  },
  {
    name: "Range Down",
    icon: "🎯⬇️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "luck", -1);
    },
  },
  {
    name: "Range Up",
    icon: "🎯⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "luck", 1);
    },
  },
  {
    name: "R U a Wizard?",
    icon: "🧙‍♂️",
  },
  {
    name: "Speed Down",
    icon: "👢⬇️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "speed", -1);
    },
  },
  {
    name: "Speed Up",
    icon: "👢⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "speed", 1);
    },
  },
  {
    name: "Tears Down",
    icon: "😭⬇️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "tears", -1);
    },
  },
  {
    name: "Tears Up",
    icon: "😭⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "tears", 1);
    },
  },
  {
    name: "Telepills",
    icon: "🌟",
  },
  {
    name: "Addicted",
    icon: "🍺",
  },
  {
    name: "Friends Till The End!",
    icon: "🙏",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "flies", 12);
    },
  },
  {
    name: "Infested!",
    icon: "🕷️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 8));
    },
  },
  {
    name: "Infested?",
    icon: "🕸️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 3));
    },
  },
  {
    name: "One Makes You Small",
    icon: "👶",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "size", -1);
    },
  },
  {
    name: "️One Makes You Larger",
    icon: "👨",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "size", 1);
    },
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
  },
  {
    name: "Retro Vision",
    icon: "👾",
  },
  {
    name: "???",
    icon: "🌽",
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
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
  },
  {
    name: "I'm Excited!!!",
    icon: "😀",
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
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Experimental Pill",
    icon: "😷",
  },
  {
    name: "Shot Speed Down",
    icon: "🚿⬇️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "shotSpeed", -1);
    },
  },
  {
    name: "Shot Speed Up",
    icon: "🚿⬆️",
    effect: async (m: GuildMember) => {
      await AdjustMemberStat(m, "shotSpeed", 1);
    },
  },
];
