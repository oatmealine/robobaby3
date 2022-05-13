import { CooldownManager } from "../cooldown";

export interface IContainerData {
  possibleContents: () => IContainerLoot;
  cost: { [key: string]: number };
  cooldown?: CooldownManager;
  buttonText: string;
  infinite?: boolean;
}

interface IContainerLoot {
  coins?: number;
  bombs?: number;
  keys?: number;
}

export const containerData: { [key: string]: IContainerData } = {
  common: {
    possibleContents: () => {
      return { coins: Math.ceil(Math.random() * 3), bombs: Math.round(Math.random() * 0.75), keys: Math.round(Math.random() * 0.75) };
    },
    cost: {},
    cooldown: new CooldownManager("commonChest", 1000 * 60 * 60 * 4),
    buttonText: "Open",
  },
  gold: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 4 + 6) };
    },
    cost: { keys: 1 },
    buttonText: "Unlock",
  },
  stone: {
    possibleContents: () => {
      return { coins: Math.round(Math.random() * 6 + 4), keys: Math.round(Math.random() * 0.7), bombs: Math.round(Math.random() * 0.7) };
    },
    cost: { bombs: 1 },
    buttonText: "Bomb",
  },
  slots: {
    possibleContents: () => {
      return { coins: Math.ceil(Math.random() * 2), keys: Math.round(Math.random() * 0.6), bombs: Math.round(Math.random() * 0.6) };
    },
    cost: {},
    cooldown: new CooldownManager("slots", 1000 * 60 * 60 * 24),
    infinite: true,
    buttonText: "Use Machine",
  },
};
