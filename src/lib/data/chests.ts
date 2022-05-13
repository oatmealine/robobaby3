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
      return { coins: Math.ceil(Math.random() * 3), bombs: Math.round(Math.random()), keys: Math.round(Math.random()) };
    },
    cost: {},
  },
  gold: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 3 + 5), bombs: Math.round(Math.random()) };
    },
    cost: { keys: 1 },
  },
  stone: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 3 + 5), keys: Math.round(Math.random()) };
    },
    cost: { bombs: 1 },
  },
};
