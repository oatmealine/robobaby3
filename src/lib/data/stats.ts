interface MemberStat {
  name: string;
  icon: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  isBasic?: boolean;
}

export const MemberStats: { [key: string]: MemberStat } = {
  health: {
    name: "Health",
    icon: "❤️",
    minValue: 0,
    maxValue: 12,
    defaultValue: 3,
    isBasic: true,
  },
  speed: {
    name: "Speed",
    icon: "👢",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  tears: {
    name: "Tears",
    icon: "💧",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  damage: {
    name: "Damage",
    icon: "⚔️",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  range: {
    name: "Range",
    icon: "🏹",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  shotSpeed: {
    name: "Shot Speed",
    icon: "💨",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  luck: {
    name: "Luck",
    icon: "🍀",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  size: {
    name: "Size",
    icon: "🍆",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  hype: {
    name: "Hype",
    icon: "🎉",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
    isBasic: true,
  },
  age: {
    name: "Age",
    icon: "💀",
    minValue: 0,
    maxValue: 3,
    defaultValue: 0,
  },
  prettyFlies: {
    name: "Pretty Flies",
    icon: "🛡️",
    minValue: 0,
    maxValue: 3,
    defaultValue: 0,
  },
  pills: {
    name: "Pills Eaten",
    icon: "💊",
    minValue: 0,
    maxValue: 9999,
    defaultValue: 0,
  },
  flies: {
    name: "# of Flies",
    icon: "🪰",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  spiders: {
    name: "# of Spiders",
    icon: "🕸️",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  poop: {
    name: "# of Poops",
    icon: "💩",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  coins: {
    name: "Coins",
    icon: "🪙",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  bombs: {
    name: "Bombs",
    icon: "💣",
    minValue: 0,
    maxValue: 99,
    defaultValue: 0,
  },
  keys: {
    name: "Keys",
    icon: "🔑",
    minValue: 0,
    maxValue: 99,
    defaultValue: 0,
  },
};

export const GetRandomStatName = (basicOnly?: boolean): string => {
  let stat = Object.keys(MemberStats)[Math.floor(Math.random() * Object.keys(MemberStats).length)];
  if (basicOnly) {
    do stat = Object.keys(MemberStats)[Math.floor(Math.random() * Object.keys(MemberStats).length)];
    while (!MemberStats[stat].isBasic);
  }
  return stat;
};
