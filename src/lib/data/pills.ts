import { GuildMember } from "discord.js";

interface Pill {
  name: string;
  icon: string;
  effect: (member: GuildMember) => void;
}

export const pills: Array<Pill> = [
  {
    name: "48 Hour Energy",
    icon: "🔋",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Amnesia",
    icon: "❓",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Bad Gas",
    icon: "💨",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Bad Trip",
    icon: "😈",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Balls of Steel",
    icon: "💙",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Bombs Are Key 🔑",
    icon: "💣",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Explosive Diarrhea",
    icon: "💥",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Full Health",
    icon: "💖",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Health Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Health Up",
    icon: "🔼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Hematemesis",
    icon: "💕",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "I Can See Forever",
    icon: "👀",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "I Found Pills",
    icon: "😏",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Lemon Party",
    icon: "🍋",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Luck Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Paralysis",
    icon: "😐",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Pheromones",
    icon: "👃",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Puberty",
    icon: "👦🏼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Pretty Fly",
    icon: "🛡️",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Range Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Range Up",
    icon: "🔼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "R U a Wizard?",
    icon: "✨",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Speed Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Speed Up",
    icon: "🔼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Tears Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Tears Up",
    icon: "🔼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Telepills",
    icon: "🌟",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Addicted",
    icon: "🍺",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Friends Till The End!",
    icon: "🙏",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Infested!",
    icon: "🕷️",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Infested?",
    icon: "🕸️",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "One Makes You Small",
    icon: "◾",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "️ One Makes You Larger",
    icon: "◼️",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Percs",
    icon: "💊",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Power Pill",
    icon: "🕹️",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Re-Lax",
    icon: "💩",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Retro Vision",
    icon: "👾",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "???",
    icon: "🌽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Gulp!",
    icon: "🍸",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Horf!",
    icon: "💣",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "I'm Drowsy...",
    icon: "😴",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "I'm Excited!!!",
    icon: "😀",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Something's wrong...",
    icon: "🤢",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Vurp!",
    icon: "😩",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "X-Lax",
    icon: "💩",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Experimental Pill",
    icon: "😷",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Shot Speed Down",
    icon: "🔽",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
  {
    name: "Shot Speed Up",
    icon: "🔼",
    effect: (m: GuildMember) => {
      console.log("Effect");
    },
  },
];
