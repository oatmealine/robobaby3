import { GuildMember, TextChannel } from "discord.js";
import { AdjustMemberStat, SetMemberStat } from "../memberStats";
import { redis } from "../redis";
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
    effect: async (m) => HideAllChannels(m, 1000 * 10),
  },
  {
    name: "Bad Gas",
    icon: "💨",
    description: "You hate side effects...",
    effect: async (m) => GiveRole(m, "Stinky", 1000 * 60 * 30),
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
  },
  {
    name: "Explosive Diarrhea",
    icon: "💩💥",
    description: "That got messy...",
    effect: async (m) => {
      GiveRole(m, "Stinky", 1000 * 60 * 30);
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
    effect: async (m) => RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 60),
  },
  {
    name: "I Found Pills",
    icon: "🥴",
    description: "Derp!",
    effect: async (m) => SetNickname(m, "🥴", 1000 * 60 * 10),
  },
  {
    name: "Lemon Party",
    icon: "🍋",
    description: "You woke up feeling wet...",
    effect: async (m) => GiveRole(m, "Bedwetter", 1000 * 60 * 30),
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
    effect: async (m) => GiveRole(m, "Thirsty", 1000 * 60 * 30),
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
    effect: async (m) => GiveRole(m, "Wizard", 1000 * 60 * 30),
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
      HideAllChannels(m, 1000 * 30);
      setTimeout(() => RevealChannel(process.env.CHANNEL_ERROR as string, m, 1000 * 30), 1000 * 2);
    },
  },
  {
    name: "Addicted",
    icon: "🍺",
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
      SetNickname(m, `${tinytext(m.displayName)}`, 1000 * 60 * 10);
      return await AdjustMemberStat(m, "size", -1);
    },
  },
  {
    name: "️One Makes You Larger",
    icon: "👨",
    description: "You feel great!",
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
    description: "You feel POWERFUL!",
    effect: async (m) => SetNickname(m, m.displayName.toUpperCase(), 1000 * 60 * 10),
  },
  {
    name: "Re-Lax",
    icon: "💩",
    description: "You feel queasy...",
    effect: async (m) => {
      GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Retro Vision",
    icon: "👾",
    description: "You feel nostalgic...",
    effect: async (m) => RevealChannel(process.env.CHANNEL_LEGACY as string, m, 1000 * 60 * 5),
  },
  {
    name: "???",
    icon: "🌽",
    description: "Is that corn?!?! WHY???",
    effect: async (m) => {
      HideAllChannels(m, 1000 * 30);
      setTimeout(() => RevealChannel(process.env.CHANNEL_SECRET as string, m, 1000 * 30), 1000 * 2);
    },
  },
  {
    name: "Feels like I'm walking on sunshine!",
    icon: "🌞",
    description: "You feel AMAZING!",
    effect: async (m) => await SetMemberStat(m, "hype", MemberStats["hype"].maxValue),
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
    effect: async (m) => redis.set(`pill:${m.id}`, "0"),
  },
  {
    name: "X-Lax",
    icon: "💩",
    description: "You feel like using the bathroom...",
    effect: async (m) => {
      GiveRole(m, "Stinky", 1000 * 60 * 30);
      return await AdjustMemberStat(m, "poop", 5);
    },
  },
  {
    name: "Experimental Pill",
    icon: "😷",
    description: "You feel a little sheepish...",
    effect: async (m) => {
      const stat1 = GetRandomStatName(true);
      const stat2 = GetRandomStatName(true);
      await AdjustMemberStat(m, stat1, -1);
      await AdjustMemberStat(m, stat2, 1);
      return [
        { stat: stat1, value: -1 },
        { stat: stat2, value: 1 },
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

const GiveRole = (member: GuildMember, roleName: string, duration: number) => {
  const role = member.guild.roles.cache.find((r) => r.name === roleName);
  if (!role) return;

  member.roles.add(role).catch(console.log);
  setTimeout(() => member.roles.remove(role).catch(console.log), duration);
};
