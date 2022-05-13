import { GuildMember } from "discord.js";
import { giveRole } from "../util";

interface Item {
  name: string;
  description: string;
  color: string;
  cost: number;
  effect: (member: GuildMember) => Promise<unknown>;
}

export const items: { [key: string]: Item } = {
  spelunker: {
    name: "Spelunker Hat",
    description: "See through doors.",
    color: "#d4ffb5",
    cost: 20,
    effect: async (member: GuildMember) => giveRole(member, "Spelunker"),
  },
  undefined: {
    name: "Undefined",
    description: "You are er̙͓͒ͅr͇͖͔̼̥̠̬̼̪̊ͤ̾ͣ̀̾̀̕ͅŏ̲͠r.",
    color: "#cb0000",
    cost: 30,
    effect: async (member: GuildMember) => giveRole(member, "Error"),
  },
  midas: {
    name: "Midas Touch",
    description: "Become a **Golden God**.",
    color: "#d7a237",
    cost: 40,
    effect: async (member: GuildMember) => giveRole(member, "Golden God"),
  },
  godhead: {
    name: "Godhead",
    description: "Obtain access to a world of secrets.",
    color: "#bbbbbb",
    cost: 80,
    effect: async (member: GuildMember) => giveRole(member, "Godhead"),
  },
};
