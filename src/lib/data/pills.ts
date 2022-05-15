import { GuildMember } from "discord.js";
import { CooldownManager } from "../cooldown";
import { PillEffects } from "../pillEffects";
import { StatManager } from "../statManager";
import { GetRandomStatName, statData } from "./stats";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tinytext = require("tiny-text");

interface IPillData {
  name: string;
  icon: string;
  description?: string;
  positive: boolean;
  effect?: (member: GuildMember) => Promise<unknown>;
}

export const pillData: { [key: string]: IPillData } = {
  energy: {
    name: "48 Hour Energy",
    icon: "🔋",
    positive: false,
  },
  amnesia: {
    name: "Amnesia",
    icon: "❓",
    description: "You find yourself in an unfamiliar place...",
    positive: false,
    effect: async (m) => PillEffects.HideAllChannels(m, 1000 * 15),
  },
  badGas: {
    name: "Bad Gas",
    icon: "💨",
    description: "You feel like you're being avoided...",
    positive: false,
    effect: async (m) => PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30),
  },
  badTrip: {
    name: "Bad Trip",
    icon: "😈",
    description: "You don't feel so good...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "health", -1),
  },
  ballsofSteel: {
    name: "Balls of Steel",
    icon: "💙",
    description: "Extra protection!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "health", 2),
  },
  bombsAreKey: {
    name: "Bombs Are Key",
    icon: "💣🔑",
    description: "Extra protection!",
    positive: true,
    effect: async (m) => {
      const bombs = await StatManager.GetStat(m, "bombs");
      const keys = await StatManager.GetStat(m, "keys");
      await StatManager.SetStat(m, "bombs", keys);
      await StatManager.SetStat(m, "keys", bombs);

      return [
        { stat: "bombs", value: bombs < keys ? 1 : -1 },
        { stat: "keys", value: keys < bombs ? 1 : -1 },
      ];
    },
  },
  explosiveDiarrhea: {
    name: "Explosive Diarrhea",
    icon: "💩💥",
    description: "That got messy...",
    positive: false,
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  fullHealth: {
    name: "Full Health",
    icon: "💖",
    description: "You feel fantastic!",
    positive: true,
    effect: async (m) => await StatManager.SetStat(m, "health", statData["health"].maxValue),
  },
  healthDown: {
    name: "Health Down",
    icon: "❤️⬇️",
    description: "Ouch...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "health", -1),
  },
  healthUp: {
    name: "Health Up",
    icon: "❤️⬆️",
    description: "You feel good!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "health", 1),
  },
  hematemesis: {
    name: "Hematemesis",
    icon: "💕",
    description: "You feel empty...",
    positive: false,
    effect: async (m) => await StatManager.SetStat(m, "health", 1 + Math.floor(Math.random() * statData["health"].maxValue)),
  },
  iCanSeeForever: {
    name: "I Can See Forever",
    icon: "👀",
    description: "You see a strange hole in the wall...",
    positive: false,
    effect: async (m) => PillEffects.RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 60),
  },
  iFoundPills: {
    name: "I Found Pills",
    icon: "🥴",
    description: "Derp!",
    positive: false,
    effect: async (m) => PillEffects.SetNickname(m, "🥴", 1000 * 60 * 10),
  },
  lemonParty: {
    name: "Lemon Party",
    icon: "🍋",
    description: "You woke up feeling wet...",
    positive: false,
    effect: async (m) => PillEffects.GiveRole(m, "Bedwetter", 1000 * 60 * 30),
  },
  luckDown: {
    name: "Luck Down",
    icon: "🍀⬇️",
    description: "You feel unlucky...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "luck", -1),
  },
  luckUp: {
    name: "Luck Up",
    icon: "🍀⬆️",
    description: "You feel like buying a scratcher!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "luck", 1),
  },
  paralysis: {
    name: "Paralysis",
    icon: "😐",
    description: "You can't move or speak...",
    positive: false,
    effect: async (m) => m.timeout(1000 * 30),
  },
  pheromones: {
    name: "Pheromones",
    icon: "👃",
    description: "You feel seductive...",
    positive: false,
    effect: async (m) => PillEffects.GiveRole(m, "Thirsty", 1000 * 60 * 30),
  },
  puberty: {
    name: "Puberty",
    icon: "👦",
    description: "You feel sticky...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "age", 1),
  },
  prettyFly: {
    name: "Pretty Fly",
    icon: "🪰",
    description: "You feel protected!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "prettyFlies", 1),
  },
  rangeDown: {
    name: "Range Down",
    icon: "🎯⬇️",
    description: "You can't see very far...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "range", -1),
  },
  rangeUp: {
    name: "Range Up",
    icon: "🎯⬆️",
    description: "You can see for miles!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "range", 1),
  },
  wizard: {
    name: "R U a Wizard?",
    icon: "🧙‍♂️",
    description: "You feel magical...",
    positive: false,
    effect: async (m) => PillEffects.GiveRole(m, "Wizard", 1000 * 60 * 30),
  },
  speedDown: {
    name: "Speed Down",
    icon: "👢⬇️",
    description: "You feel slow...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "speed", -1),
  },
  speedUp: {
    name: "Speed Up",
    icon: "👢⬆️",
    description: "You feel lightning quick!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "speed", 1),
  },
  tearsDown: {
    name: "Tears Down",
    icon: "😭⬇️",
    description: "You feel happy...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "tears", -1),
  },
  tearsUp: {
    name: "Tears Up",
    icon: "😭⬆️",
    description: "You feel sad!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "tears", 1),
  },
  telepills: {
    name: "Telepills",
    icon: "🌟",
    description: "You find yourself in a stra̺̫͢n͖̣̮̪͖̥g̛̣̘e̪ p͉̯l҉͕̻̞̺̙̜̻̀̕ͅà̢̹̞̠c̢̗̻͖̩̀͟͠è̸̛̫͇̝̖̮͈͎̘̠̲͔̕",
    positive: false,
    effect: async (m) => {
      PillEffects.HideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.RevealChannel(process.env.CHANNEL_ERROR as string, m, 1000 * 30), 1000 * 2);
    },
  },
  addicted: {
    name: "Addicted",
    icon: "🍺",
    description: "You just can't stop... why not have another?",
    positive: false,
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  friends: {
    name: "Friends Till The End!",
    icon: "🙏",
    description: "You feel loved!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "flies", 12),
  },
  infested: {
    name: "Infested!",
    icon: "🕷️",
    description: "You feel terrified!",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "spiders", Math.ceil(Math.random() * 8)),
  },
  maybeInfested: {
    name: "Infested?",
    icon: "🕸️",
    description: "You feel terrified?",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "spiders", Math.ceil(Math.random() * 3)),
  },
  small: {
    name: "One Makes You Small",
    icon: "👶",
    description: "You feel emasculated...",
    positive: false,
    effect: async (m) => {
      PillEffects.SetNickname(m, `${tinytext(m.displayName)}`, 1000 * 60 * 10);
      return await StatManager.AdjustStat(m, "size", -1);
    },
  },
  larger: {
    name: "️One Makes You Larger",
    icon: "👨",
    description: "You feel great!",
    positive: true,
    effect: async (m) => {
      PillEffects.SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10);
      return await StatManager.AdjustStat(m, "size", 1);
    },
  },
  percs: {
    name: "Percs",
    icon: "💊",
    description: "You feel like you could use another...",
    positive: false,
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  powerPill: {
    name: "Power Pill",
    icon: "🕹️",
    description: "You feel POWERFUL!",
    positive: false,
    effect: async (m) => PillEffects.SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10),
  },
  relax: {
    name: "Re-Lax",
    icon: "💩",
    description: "You feel queasy...",
    positive: false,
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  retroVision: {
    name: "Retro Vision",
    icon: "👾",
    description: "You feel nostalgic...",
    positive: false,
    effect: async (m) => PillEffects.RevealChannel(process.env.CHANNEL_LEGACY as string, m, 1000 * 60 * 5),
  },
  questionMark: {
    name: "???",
    icon: "🌽",
    description: "Where'd you go?",
    positive: false,
    effect: async (m) => {
      PillEffects.HideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 30), 1000 * 2);
    },
  },
  sunshine: {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    description: "You feel AMAZING!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "hype", 2),
  },
  gulp: {
    name: "Gulp!",
    icon: "🍸",
    description: "You feel full!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, GetRandomStatName(true), 1),
  },
  horf: {
    name: "Horf!",
    icon: "🧨",
    description: "You feel stronger!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "bombs", 1),
  },
  drowsy: {
    name: "I'm Drowsy...",
    icon: "😴",
    description: "You feel like taking a nap...",
    positive: false,
    effect: async (m) => {
      m.timeout(1000 * 30);
      return await StatManager.AdjustStat(m, "hype", -1);
    },
  },
  excited: {
    name: "I'm Excited!!!",
    icon: "😀",
    description: "You're on top of the freaking world!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "hype", 1),
  },
  somethingsWrong: {
    name: "Something's wrong...",
    icon: "😵‍💫",
    description: "You feel like that color isn't quite right...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "poop", 2),
  },
  vurp: {
    name: "Vurp!",
    icon: "😩",
    description: "You feel ready to go again!",
    positive: false,
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  xlax: {
    name: "X-Lax",
    icon: "💩",
    description: "You feel like using the bathroom...",
    positive: false,
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  experimental: {
    name: "Experimental Pill",
    icon: "😷",
    description: "You feel a little sheepish...",
    positive: true,
    effect: async (m) => {
      const primaryStat = GetRandomStatName(true);
      let secondaryStat = GetRandomStatName(true);
      do secondaryStat = GetRandomStatName(true);
      while (primaryStat === secondaryStat);

      StatManager.AdjustStat(m, primaryStat, 1);
      await StatManager.AdjustStat(m, secondaryStat, -1);
      return [
        { stat: primaryStat, value: 1 },
        { stat: secondaryStat, value: -1 },
      ];
    },
  },
  shotSpeedDown: {
    name: "Shot Speed Down",
    icon: "🚿⬇️",
    description: "You feel like your shot speed went down...",
    positive: false,
    effect: async (m) => await StatManager.AdjustStat(m, "shotSpeed", -1),
  },
  shotSpeedUp: {
    name: "Shot Speed Up",
    icon: "🚿⬆️",
    description: "You feel like your shot speed went up!",
    positive: true,
    effect: async (m) => await StatManager.AdjustStat(m, "shotSpeed", 1),
  },
};

export const GetRandomPill = (onlyPositive: boolean): IPillData => {
  const positiveKeys = Object.keys(pillData).filter((key) => pillData[key].positive === onlyPositive);
  return pillData[positiveKeys[Math.floor(Math.random() * positiveKeys.length)]];
};
