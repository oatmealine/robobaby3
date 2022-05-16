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
  chestGold: 32,
  chestStone: 3,
  poopNormal: 3,
  poopCorn: 3,
  poopGold: 2,
  chestCommon: 1,
};

export const containerData: { [key: string]: IContainerData } = {
  // chests
  chestCommon: {
    cooldown: new CooldownManager("chestCommon", 1000 * 60 * 2),
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
  chestGold: {
    cooldown: new CooldownManager("chestGold", 1000 * 60 * 2),
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
  chestStone: {
    cooldown: new CooldownManager("chestStone", 1000 * 60 * 2),
    actions: {
      blowUp: {
        label: "Blow Up",
        cost: { bombs: 1 },
        effect: () => {
          return { coins: Math.round(Math.random() * 4) + 2, keys: Math.round(Math.random() * 2), bombs: Math.round(Math.random() * 0.65) };
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
          return Math.random() > 0.3 ? { coins: 1 } : { bombs: 1 };
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
          return { coins: 1, bombs: Math.round(Math.random()) };
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
          return { coins: Math.ceil(Math.random() * 4), keys: Math.round(Math.random() * 1) + 2 };
        },
      },
      blowUp: {
        label: "Blow Up",
        cost: { bombs: 1 },
        effect: () => {
          return { coins: Math.ceil(Math.random() * 4) + 5, bombs: Math.round(Math.random() * 0.65) };
        },
      },
    },
  },
  bombDisp: {
    infinite: true,
    cooldown: new CooldownManager("bombDisp", 1000 * 60 * 60 * 24 * 7),
    actions: {
      use: {
        label: "Take One",
        cost: {},
        effect: () => {
          return { bombs: 1 };
        },
      },
    },
  },
  chestEternal: {
    infinite: true,
    cooldown: new CooldownManager("chestEternal", 1000 * 60 * 60 * 4),
    actions: {
      unlock: {
        label: "Unlock",
        cost: { keys: 1 },
        effect: () => {
          return { coins: Math.round(Math.random() * 2.65), keys: Math.round(Math.random() * 0.525), bombs: Math.round(Math.random() * 0.525) };
        },
      },
    },
  },
};
