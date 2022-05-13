import { ButtonInteraction } from "discord.js";
import { CooldownManager } from "../cooldown";

export interface IContainerData {
  infinite?: boolean;
  cooldown?: CooldownManager;
  actions: { [key: string]: IContainerAction };
}

export interface IContainerAction {
  label: string;
  cost: { [key: string]: number };
  effect: (i: ButtonInteraction) => ILoot | void;
}

export interface ILoot {
  coins?: number;
  bombs?: number;
  keys?: number;
}

export const containerData: { [key: string]: IContainerData } = {
  common: {
    cooldown: new CooldownManager("commonChest", 1000 * 60 * 60 * 4),
    actions: {
      open: {
        label: "Open",
        cost: {},
        effect: () => {
          return { coins: Math.ceil(Math.random() * 2), keys: Math.round(Math.random() * 0.55), bombs: Math.round(Math.random() * 0.55) };
        },
      },
    },
  },
  gold: {
    actions: {
      unlock: {
        label: "Unlock",
        cost: { keys: 1 },
        effect: () => {
          return { coins: Math.round(Math.random() * 4) + 6, bombs: Math.round(Math.random() * 0.6) };
        },
      },
    },
  },
  stone: {
    actions: {
      blowUp: {
        label: "Blow Up",
        cost: { bombs: 1 },
        effect: () => {
          return { coins: Math.round(Math.random() * 4) + 4, keys: Math.round(Math.random() * 0.6), bombs: Math.round(Math.random() * 0.6) };
        },
      },
    },
  },
  slots: {
    infinite: true,
    cooldown: new CooldownManager("slots", 1000 * 60 * 60 * 20),
    actions: {
      use: {
        label: "Use",
        cost: {},
        effect: () => {
          return { coins: Math.ceil(Math.random() * 3), keys: Math.round(Math.random() * 0.55), bombs: Math.round(Math.random() * 0.55) };
        },
      },
      blowUp: {
        label: "Blow Up",
        cost: { bombs: 1 },
        effect: () => {
          return { coins: Math.ceil(Math.random() * 3) + 3, keys: Math.round(Math.random() * 0.65) };
        },
      },
    },
  },
};
