import { GuildMember } from "discord.js";
import { AdjustMemberStat, GetMemberStat, SetMemberStat } from "../memberStats";
import { PillEffects } from "../pills";
import { GetRandomStatName, MemberStats } from "./stats";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tinytext = require("tiny-text");

interface Pill {
  name: string;
  icon: string;
  description?: string;
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
    description: "You find yourself in an unfamiliar place...",
    effect: async (m) => PillEffects.hideAllChannels(m, 1000 * 15),
  },
  {
    name: "Bad Gas",
    icon: "💨",
    description: "You feel like you're being avoided...",
    effect: async (m) => PillEffects.giveRole(m, "Stinky", 1000 * 60 * 30),
  },
  {
    name: "Bad Trip",
    icon: "😈",
    description: "You don't feel so good...",
    effect: async (m) => await AdjustMemberStat(m, "health", -1),
  },
  {
    name: "Balls of Steel",
    icon: "💙",
    description: "Extra protection!",
    effect: async (m) => await AdjustMemberStat(m, "health", 2),
  },
  {
    name: "Bombs Are Key",
    icon: "💣🔑",
    description: "Extra protection!",
    effect: async (m) => {
      const bombs = await GetMemberStat(m, "bombs");
      const keys = await GetMemberStat(m, "keys");
      await SetMemberStat(m, "bombs", keys);
      await SetMemberStat(m, "keys", bombs);

      return [
        { stat: "bombs", value: bombs < keys ? 1 : -1 },
        { stat: "keys", value: keys < bombs ? 1 : -1 },
      ];
    },
  },
  {
    name: "Explosive Diarrhea",
    icon: "💩💥",
    description: "That got messy...",
    effect: async (m) => {
      PillEffects.giveRole(m, "Stinky", 1000 * 60 * 30);
      return await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Full Health",
    icon: "💖",
    description: "You feel fantastic!",
    effect: async (m) => await SetMemberStat(m, "health", MemberStats["health"].maxValue),
  },
  {
    name: "Health Down",
    icon: "❤️⬇️",
    description: "Ouch...",
    effect: async (m) => await AdjustMemberStat(m, "health", -1),
  },
  {
    name: "Health Up",
    icon: "❤️⬆️",
    description: "You feel good!",
    effect: async (m) => await AdjustMemberStat(m, "health", 1),
  },
  {
    name: "Hematemesis",
    icon: "💕",
    description: "You feel empty...",
    effect: async (m) => await SetMemberStat(m, "health", 1 + Math.floor(Math.random() * MemberStats["health"].maxValue)),
  },
  {
    name: "I Can See Forever",
    icon: "👀",
    description: "You see a strange hole in the wall...",
    effect: async (m) => PillEffects.revealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 60),
  },
  {
    name: "I Found Pills",
    icon: "🥴",
    description: "Derp!",
    effect: async (m) => PillEffects.setNickname(m, "🥴", 1000 * 60 * 10),
  },
  {
    name: "Lemon Party",
    icon: "🍋",
    description: "You woke up feeling wet...",
    effect: async (m) => PillEffects.giveRole(m, "Bedwetter", 1000 * 60 * 30),
  },
  {
    name: "Luck Down",
    icon: "🍀⬇️",
    description: "You feel unlucky...",
    effect: async (m) => await AdjustMemberStat(m, "luck", -1),
  },
  {
    name: "Luck Up",
    icon: "🍀⬆️",
    description: "You feel like buying a scratcher!",
    effect: async (m) => await AdjustMemberStat(m, "luck", 1),
  },
  {
    name: "Paralysis",
    icon: "😐",
    description: "You can't move or speak...",
    effect: async (m) => m.timeout(1000 * 30),
  },
  {
    name: "Pheromones",
    icon: "👃",
    description: "You feel seductive...",
    effect: async (m) => PillEffects.giveRole(m, "Thirsty", 1000 * 60 * 30),
  },
  {
    name: "Puberty",
    icon: "👦",
    description: "You feel sticky...",
    effect: async (m) => await AdjustMemberStat(m, "age", 1),
  },
  {
    name: "Pretty Fly",
    icon: "🪰",
    description: "You feel protected!",
    effect: async (m) => await AdjustMemberStat(m, "prettyFlies", 1),
  },
  {
    name: "Range Down",
    icon: "🎯⬇️",
    description: "You can't see very far...",
    effect: async (m) => await AdjustMemberStat(m, "range", -1),
  },
  {
    name: "Range Up",
    icon: "🎯⬆️",
    description: "You can see for miles!",
    effect: async (m) => await AdjustMemberStat(m, "range", 1),
  },
  {
    name: "R U a Wizard?",
    icon: "🧙‍♂️",
    description: "You feel magical...",
    effect: async (m) => PillEffects.giveRole(m, "Wizard", 1000 * 60 * 30),
  },
  {
    name: "Speed Down",
    icon: "👢⬇️",
    description: "You feel slow...",
    effect: async (m) => await AdjustMemberStat(m, "speed", -1),
  },
  {
    name: "Speed Up",
    icon: "👢⬆️",
    description: "You feel lightning quick!",
    effect: async (m) => await AdjustMemberStat(m, "speed", 1),
  },
  {
    name: "Tears Down",
    icon: "😭⬇️",
    description: "You feel happy...",
    effect: async (m) => await AdjustMemberStat(m, "tears", -1),
  },
  {
    name: "Tears Up",
    icon: "😭⬆️",
    description: "You feel sad!",
    effect: async (m) => await AdjustMemberStat(m, "tears", 1),
  },
  {
    name: "Telepills",
    icon: "🌟",
    description: "You find yourself in a stra̺̫͢n͖̣̮̪͖̥g̛̣̘e̪ p͉̯l҉͕̻̞̺̙̜̻̀̕ͅà̢̹̞̠c̢̗̻͖̩̀͟͠è̸̛̫͇̝̖̮͈͎̘̠̲͔̕",
    effect: async (m) => {
      PillEffects.hideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.revealChannel(process.env.CHANNEL_ERROR as string, m, 1000 * 30), 1000 * 2);
    },
  },
  {
    name: "Addicted",
    icon: "🍺",
    description: "You just can't stop...",
    effect: async (m) => PillEffects.resetCooldown(m),
  },
  {
    name: "Friends Till The End!",
    icon: "🙏",
    description: "You feel loved!",
    effect: async (m) => await AdjustMemberStat(m, "flies", 12),
  },
  {
    name: "Infested!",
    icon: "🕷️",
    description: "You feel terrified!",
    effect: async (m) => await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 8)),
  },
  {
    name: "Infested?",
    icon: "🕸️",
    description: "You feel terrified?",
    effect: async (m) => await AdjustMemberStat(m, "spiders", Math.ceil(Math.random() * 3)),
  },
  {
    name: "One Makes You Small",
    icon: "👶",
    description: "You feel emasculated...",
    effect: async (m) => {
      PillEffects.setNickname(m, `${tinytext(m.displayName)}`, 1000 * 60 * 10);
      return await AdjustMemberStat(m, "size", -1);
    },
  },
  {
    name: "️One Makes You Larger",
    icon: "👨",
    description: "You feel great!",
    effect: async (m) => {
      PillEffects.setNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10);
      return await AdjustMemberStat(m, "size", 1);
    },
  },
  {
    name: "Percs",
    icon: "💊",
    description: "You feel like you could use another...",
    effect: async (m) => PillEffects.resetCooldown(m),
  },
  {
    name: "Power Pill",
    icon: "🕹️",
    description: "You feel POWERFUL!",
    effect: async (m) => PillEffects.setNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10),
  },
  {
    name: "Re-Lax",
    icon: "💩",
    description: "You feel queasy...",
    effect: async (m) => {
      PillEffects.giveRole(m, "Stinky", 1000 * 60 * 30);
      return await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Retro Vision",
    icon: "👾",
    description: "You feel nostalgic...",
    effect: async (m) => PillEffects.revealChannel(process.env.CHANNEL_LEGACY as string, m, 1000 * 60 * 5),
  },
  {
    name: "???",
    icon: "🌽",
    description: "Where'd you go?",
    effect: async (m) => {
      PillEffects.hideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.revealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 30), 1000 * 2);
    },
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    description: "You feel AMAZING!",
    effect: async (m) => await AdjustMemberStat(m, "hype", 2),
  },
  {
    name: "Gulp!",
    icon: "🍸",
    description: "You feel full!",
    effect: async (m) => await AdjustMemberStat(m, GetRandomStatName(true), 1),
  },
  {
    name: "Horf!",
    icon: "🧨",
    description: "You feel stronger!",
    effect: async (m) => await AdjustMemberStat(m, "damage", 1),
  },
  {
    name: "I'm Drowsy...",
    icon: "😴",
    description: "You feel like taking a nap...",
    effect: async (m) => {
      m.timeout(1000 * 30);
      return await AdjustMemberStat(m, "hype", -1);
    },
  },
  {
    name: "I'm Excited!!!",
    icon: "😀",
    description: "You're on top of the freaking world!",
    effect: async (m) => await AdjustMemberStat(m, "hype", 1),
  },
  {
    name: "Something's wrong...",
    icon: "😵‍💫",
    description: "You feel like that color isn't quite right...",
    effect: async (m) => await AdjustMemberStat(m, "poop", 2),
  },
  {
    name: "Vurp!",
    icon: "😩",
    description: "You feel ready to go again!",
    effect: async (m) => PillEffects.resetCooldown(m),
  },
  {
    name: "X-Lax",
    icon: "💩",
    description: "You feel like using the bathroom...",
    effect: async (m) => {
      PillEffects.giveRole(m, "Stinky", 1000 * 60 * 30);
      return await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Experimental Pill",
    icon: "😷",
    description: "You feel a little sheepish...",
    effect: async (m) => {
      const primaryStat = GetRandomStatName(true);
      let secondaryStat = GetRandomStatName(true);
      do secondaryStat = GetRandomStatName(true);
      while (primaryStat === secondaryStat);

      AdjustMemberStat(m, primaryStat, 1);
      await AdjustMemberStat(m, secondaryStat, -1);
      return [
        { stat: primaryStat, value: 1 },
        { stat: secondaryStat, value: -1 },
      ];
    },
  },
  {
    name: "Shot Speed Down",
    icon: "🚿⬇️",
    description: "You feel like your shot speed went down...",
    effect: async (m) => await AdjustMemberStat(m, "shotSpeed", -1),
  },
  {
    name: "Shot Speed Up",
    icon: "🚿⬆️",
    description: "You feel like your shot speed went up!",
    effect: async (m) => await AdjustMemberStat(m, "shotSpeed", 1),
  },
];

export const GetRandomPill = (): Pill => {
  return pills[Math.floor(Math.random() * pills.length)];
};
