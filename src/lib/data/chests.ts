interface ChestLoot {
  coins?: number;
  bombs?: number;
  keys?: number;
}

interface ChestData {
  possibleContents: () => ChestLoot;
  cost: { [key: string]: number };
}

export const chests: { [key: string]: ChestData } = {
  common: {
    possibleContents: () => {
      return { coins: Math.ceil(Math.random() * 3), bombs: Math.round(Math.random() * 0.75), keys: Math.round(Math.random() * 0.75) };
    },
    cost: {},
  },
  gold: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 4 + 6) };
    },
    cost: { keys: 1 },
  },
  stone: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 6 + 4), keys: Math.round(Math.random() * 0.7), bombs: Math.round(Math.random() * 0.7) };
    },
    cost: { bombs: 1 },
  },
};
