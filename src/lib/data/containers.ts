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

export const containerSpawnPool = {
  gold: 24,
  common: 1,
  stone: 1,
  poopNormal: 3,
  poopGold: 2,
  poopCorn: 3,
};

export const containerData: { [key: string]: IContainerData } = {
  // chests
  common: {
    actions: {
      open: {
        label: "Open",
        cost: {},
        effect: () => {
          return { coins: Math.ceil(Math.random() * 3), keys: Math.round(Math.random() * 0.6), bombs: Math.round(Math.random() * 0.55) };
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
          return { coins: Math.ceil(Math.random() * 3), bombs: Math.round(Math.random() * 0.6) };
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
          return { coins: Math.round(Math.random() * 4) + 2, keys: Math.round(Math.random() * 0.6), bombs: Math.round(Math.random() * 0.6) };
        },
      },
    },
  },
  // poops
  poopNormal: {
    actions: {
      destroy: {
        label: "Destroy",
        cost: {},
        effect: () => {
          return { coins: 1 };
        },
      },
    },
  },
  poopGold: {
    actions: {
      destroy: {
        label: "Salvage",
        cost: {},
        effect: () => {
          return { coins: Math.round(Math.random()) * 2 + 2 };
        },
      },
    },
  },
  poopCorn: {
    actions: {
      destroy: {
        label: "Destroy",
        cost: {},
        effect: () => {
          return { coins: 1 };
        },
      },
      eat: {
        label: "Eat",
        cost: { health: 1 },
        effect: () => {
          return { coins: 2 };
        },
      },
    },
  },
  // arcades
  slots: {
    infinite: true,
    cooldown: new CooldownManager("slots", 1000 * 60 * 60 * 20),
    actions: {
      use: {
        label: "Use",
        cost: { coins: 1 },
        effect: () => {
          return { coins: Math.ceil(Math.random() * 4), keys: Math.round(Math.random() * 2) + 2 };
        },
      },
      blowUp: {
        label: "Blow Up",
        cost: { bombs: 1 },
        effect: () => {
          return { coins: Math.ceil(Math.random() * 4) + 3, keys: Math.round(Math.random() * 3) + 3, bombs: Math.round(Math.random() * 0.55) };
        },
      },
    },
  },
};
