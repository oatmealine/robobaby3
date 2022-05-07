interface MemberStat {
  name: string;
  icon?: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export const MemberStats: { [key: string]: MemberStat } = {
  health: {
    name: "Health",
    icon: "❤️",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
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
  age: {
    name: "Age",
    icon: "💀",
    minValue: 0,
    maxValue: 3,
    defaultValue: 0,
  },
  flies: {
    name: "# of Flies",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  spiders: {
    name: "# of Spiders",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
  poop: {
    name: "# of Poops",
    minValue: 0,
    maxValue: 999,
    defaultValue: 0,
  },
};
