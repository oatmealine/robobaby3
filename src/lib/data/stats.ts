interface MemberStat {
  name: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export const MemberStats: { [key: string]: MemberStat } = {
  health: {
    name: "Health",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  speed: {
    name: "Speed",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  tears: {
    name: "Tears",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  damage: {
    name: "Damage",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  range: {
    name: "Range",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  shotSpeed: {
    name: "Shot Speed",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  luck: {
    name: "Luck",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  size: {
    name: "Size",
    minValue: 0,
    maxValue: 7,
    defaultValue: 2,
  },
  age: {
    name: "Age",
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
