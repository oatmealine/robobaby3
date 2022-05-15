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
  effect?: (member: GuildMember) => Promise<unknown>;
}

export const pillData: { [key: string]: IPillData } = {
  energy: {
    name: "48 Hour Energy",
    icon: "🔋",
  },
  amnesia: {
    name: "Amnesia",
    icon: "❓",
    description: "You find yourself in an unfamiliar place...",
    effect: async (m) => PillEffects.HideAllChannels(m, 1000 * 15),
  },
  badGas: {
    name: "Bad Gas",
    icon: "💨",
    description: "You feel like you're being avoided...",
    effect: async (m) => PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30),
  },
  badTrip: {
    name: "Bad Trip",
    icon: "😈",
    description: "You don't feel so good...",
    effect: async (m) => await StatManager.AdjustStat(m, "health", -1),
  },
  ballsofSteel: {
    name: "Balls of Steel",
    icon: "💙",
    description: "Extra protection!",
    effect: async (m) => await StatManager.AdjustStat(m, "health", 2),
  },
  bombsAreKey: {
    name: "Bombs Are Key",
    icon: "💣🔑",
    description: "Extra protection!",
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
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  fullHealth: {
    name: "Full Health",
    icon: "💖",
    description: "You feel fantastic!",
    effect: async (m) => await StatManager.SetStat(m, "health", statData["health"].maxValue),
  },
  healthDown: {
    name: "Health Down",
    icon: "❤️⬇️",
    description: "Ouch...",
    effect: async (m) => await StatManager.AdjustStat(m, "health", -1),
  },
  healthUp: {
    name: "Health Up",
    icon: "❤️⬆️",
    description: "You feel good!",
    effect: async (m) => await StatManager.AdjustStat(m, "health", 1),
  },
  hematemesis: {
    name: "Hematemesis",
    icon: "💕",
    description: "You feel empty...",
    effect: async (m) => await StatManager.SetStat(m, "health", 1 + Math.floor(Math.random() * statData["health"].maxValue)),
  },
  iCanSeeForever: {
    name: "I Can See Forever",
    icon: "👀",
    description: "You see a strange hole in the wall...",
    effect: async (m) => PillEffects.RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 60),
  },
  iFoundPills: {
    name: "I Found Pills",
    icon: "🥴",
    description: "Derp!",
    effect: async (m) => PillEffects.SetNickname(m, "🥴", 1000 * 60 * 10),
  },
  lemonParty: {
    name: "Lemon Party",
    icon: "🍋",
    description: "You woke up feeling wet...",
    effect: async (m) => PillEffects.GiveRole(m, "Bedwetter", 1000 * 60 * 30),
  },
  luckDown: {
    name: "Luck Down",
    icon: "🍀⬇️",
    description: "You feel unlucky...",
    effect: async (m) => await StatManager.AdjustStat(m, "luck", -1),
  },
  luckUp: {
    name: "Luck Up",
    icon: "🍀⬆️",
    description: "You feel like buying a scratcher!",
    effect: async (m) => await StatManager.AdjustStat(m, "luck", 1),
  },
  paralysis: {
    name: "Paralysis",
    icon: "😐",
    description: "You can't move or speak...",
    effect: async (m) => m.timeout(1000 * 30),
  },
  pheromones: {
    name: "Pheromones",
    icon: "👃",
    description: "You feel seductive...",
    effect: async (m) => PillEffects.GiveRole(m, "Thirsty", 1000 * 60 * 30),
  },
  puberty: {
    name: "Puberty",
    icon: "👦",
    description: "You feel sticky...",
    effect: async (m) => await StatManager.AdjustStat(m, "age", 1),
  },
  prettyFly: {
    name: "Pretty Fly",
    icon: "🪰",
    description: "You feel protected!",
    effect: async (m) => await StatManager.AdjustStat(m, "prettyFlies", 1),
  },
  rangeDown: {
    name: "Range Down",
    icon: "🎯⬇️",
    description: "You can't see very far...",
    effect: async (m) => await StatManager.AdjustStat(m, "range", -1),
  },
  rangeUp: {
    name: "Range Up",
    icon: "🎯⬆️",
    description: "You can see for miles!",
    effect: async (m) => await StatManager.AdjustStat(m, "range", 1),
  },
  wizard: {
    name: "R U a Wizard?",
    icon: "🧙‍♂️",
    description: "You feel magical...",
    effect: async (m) => PillEffects.GiveRole(m, "Wizard", 1000 * 60 * 30),
  },
  speedDown: {
    name: "Speed Down",
    icon: "👢⬇️",
    description: "You feel slow...",
    effect: async (m) => await StatManager.AdjustStat(m, "speed", -1),
  },
  speedUp: {
    name: "Speed Up",
    icon: "👢⬆️",
    description: "You feel lightning quick!",
    effect: async (m) => await StatManager.AdjustStat(m, "speed", 1),
  },
  tearsDown: {
    name: "Tears Down",
    icon: "😭⬇️",
    description: "You feel happy...",
    effect: async (m) => await StatManager.AdjustStat(m, "tears", -1),
  },
  tearsUp: {
    name: "Tears Up",
    icon: "😭⬆️",
    description: "You feel sad!",
    effect: async (m) => await StatManager.AdjustStat(m, "tears", 1),
  },
  telepills: {
    name: "Telepills",
    icon: "🌟",
    description: "You find yourself in a stra̺̫͢n͖̣̮̪͖̥g̛̣̘e̪ p͉̯l҉͕̻̞̺̙̜̻̀̕ͅà̢̹̞̠c̢̗̻͖̩̀͟͠è̸̛̫͇̝̖̮͈͎̘̠̲͔̕",
    effect: async (m) => {
      PillEffects.HideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.RevealChannel(process.env.CHANNEL_ERROR as string, m, 1000 * 30), 1000 * 2);
    },
  },
  addicted: {
    name: "Addicted",
    icon: "🍺",
    description: "You just can't stop... why not have another?",
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  friends: {
    name: "Friends Till The End!",
    icon: "🙏",
    description: "You feel loved!",
    effect: async (m) => await StatManager.AdjustStat(m, "flies", 12),
  },
  infested: {
    name: "Infested!",
    icon: "🕷️",
    description: "You feel terrified!",
    effect: async (m) => await StatManager.AdjustStat(m, "spiders", Math.ceil(Math.random() * 8)),
  },
  maybeInfested: {
    name: "Infested?",
    icon: "🕸️",
    description: "You feel terrified?",
    effect: async (m) => await StatManager.AdjustStat(m, "spiders", Math.ceil(Math.random() * 3)),
  },
  small: {
    name: "One Makes You Small",
    icon: "👶",
    description: "You feel emasculated...",
    effect: async (m) => {
      PillEffects.SetNickname(m, `${tinytext(m.displayName)}`, 1000 * 60 * 10);
      return await StatManager.AdjustStat(m, "size", -1);
    },
  },
  larger: {
    name: "️One Makes You Larger",
    icon: "👨",
    description: "You feel great!",
    effect: async (m) => {
      PillEffects.SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10);
      return await StatManager.AdjustStat(m, "size", 1);
    },
  },
  percs: {
    name: "Percs",
    icon: "💊",
    description: "You feel like you could use another...",
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  powerPill: {
    name: "Power Pill",
    icon: "🕹️",
    description: "You feel POWERFUL!",
    effect: async (m) => PillEffects.SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10),
  },
  relax: {
    name: "Re-Lax",
    icon: "💩",
    description: "You feel queasy...",
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  retroVision: {
    name: "Retro Vision",
    icon: "👾",
    description: "You feel nostalgic...",
    effect: async (m) => PillEffects.RevealChannel(process.env.CHANNEL_LEGACY as string, m, 1000 * 60 * 5),
  },
  questionMark: {
    name: "???",
    icon: "🌽",
    description: "Where'd you go?",
    effect: async (m) => {
      PillEffects.HideAllChannels(m, 1000 * 30);
      setTimeout(() => PillEffects.RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 30), 1000 * 2);
    },
  },
  sunshine: {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    description: "You feel AMAZING!",
    effect: async (m) => await StatManager.AdjustStat(m, "hype", 2),
  },
  gulp: {
    name: "Gulp!",
    icon: "🍸",
    description: "You feel full!",
    effect: async (m) => await StatManager.AdjustStat(m, GetRandomStatName(true), 1),
  },
  horf: {
    name: "Horf!",
    icon: "🧨",
    description: "You feel stronger!",
    effect: async (m) => await StatManager.AdjustStat(m, "bombs", 1),
  },
  drowsy: {
    name: "I'm Drowsy...",
    icon: "😴",
    description: "You feel like taking a nap...",
    effect: async (m) => {
      m.timeout(1000 * 30);
      return await StatManager.AdjustStat(m, "hype", -1);
    },
  },
  excited: {
    name: "I'm Excited!!!",
    icon: "😀",
    description: "You're on top of the freaking world!",
    effect: async (m) => await StatManager.AdjustStat(m, "hype", 1),
  },
  somethingsWrong: {
    name: "Something's wrong...",
    icon: "😵‍💫",
    description: "You feel like that color isn't quite right...",
    effect: async (m) => await StatManager.AdjustStat(m, "poop", 2),
  },
  vurp: {
    name: "Vurp!",
    icon: "😩",
    description: "You feel ready to go again!",
    effect: async (m) => CooldownManager.ResetCooldown("pill", m),
  },
  xlax: {
    name: "X-Lax",
    icon: "💩",
    description: "You feel like using the bathroom...",
    effect: async (m) => {
      PillEffects.GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await StatManager.AdjustStat(m, "poop", 5);
    },
  },
  experimental: {
    name: "Experimental Pill",
    icon: "😷",
    description: "You feel a little sheepish...",
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
    effect: async (m) => await StatManager.AdjustStat(m, "shotSpeed", -1),
  },
  shotSpeedUp: {
    name: "Shot Speed Up",
    icon: "🚿⬆️",
    description: "You feel like your shot speed went up!",
    effect: async (m) => await StatManager.AdjustStat(m, "shotSpeed", 1),
  },
};

export const GetRandomPill = (): IPillData => {
  const keys = Object.keys(pillData);
  return pillData[keys[Math.floor(Math.random() * keys.length)]];
};
