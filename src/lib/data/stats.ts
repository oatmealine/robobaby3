interface MemberStat {
  name: string;
  icon: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export const MemberStats: { [key: string]: MemberStat } = {
  health: {
    name: "Health",
    icon: "❤️",
    minValue: 0,
    maxValue: 12,
    defaultValue: 3,
  },
  speed: {
    name: "Speed",
    icon: "👢",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  tears: {
    name: "Tears",
    icon: "💧",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  damage: {
    name: "Damage",
    icon: "⚔️",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  range: {
    name: "Range",
    icon: "🏹",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  shotSpeed: {
    name: "Shot Speed",
    icon: "💨",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  luck: {
    name: "Luck",
    icon: "🍀",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  size: {
    name: "Size",
    icon: "🍆",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  hype: {
    name: "Hype",
    icon: "🎉",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
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
    icon: "🕷",
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
};

export const GetRandomStat = (): string => {
  return Object.keys(MemberStats)[Math.floor(Math.random() * Object.keys(MemberStats).length)];
};
