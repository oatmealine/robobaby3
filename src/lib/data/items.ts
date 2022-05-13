import { GuildMember } from "discord.js";
import { PillEffects } from "../pills";
import { giveRole } from "../util";

interface Item {
  name: string;
  description: string;
  color: string;
  cost: number;
  unique: boolean;
  effect: (member: GuildMember) => Promise<unknown>;
}

export const items: { [key: string]: Item } = {
  spelunker: {
    name: "Spelunker Hat",
    description: "See through doors.",
    color: "#d4ffb5",
    cost: 20,
    unique: true,
    effect: async (member: GuildMember) => giveRole(member, "Spelunker"),
  },
  undefined: {
    name: "Undefined",
    description: "You are er̙͓͒ͅr͇͖͔̼̥̠̬̼̪̊ͤ̾ͣ̀̾̀̕ͅŏ̲͠r.",
    color: "#cb0000",
    cost: 30,
    unique: true,
    effect: async (member: GuildMember) => giveRole(member, "Error"),
  },
  midas: {
    name: "Midas Touch",
    description: "Become a **Golden God**.",
    color: "#d7a237",
    cost: 40,
    unique: true,
    effect: async (member: GuildMember) => giveRole(member, "Golden God"),
  },
  godhead: {
    name: "Godhead",
    description: "Obtain access to a world of secrets.",
    color: "#bbbbbb",
    cost: 50,
    unique: true,
    effect: async (member: GuildMember) => giveRole(member, "Godhead"),
  },
  pillBottle: {
    name: "Mom's Bottle of Pills",
    description: "Refresh your pill cooldown.",
    color: "#f7bb43",
    cost: 5,
    unique: false,
    effect: async (member: GuildMember) => PillEffects.resetCooldown(member),
  },
};
