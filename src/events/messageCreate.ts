import { Message } from "discord.js";
import { removeInvites } from "../lib/message";

const roboReacts: string[] = ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😴", "😵", "😶"];

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    removeInvites(message);

    // react to name
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 4000 + 1000));
    if (["robo", "baby"].some((el) => message.content.toLowerCase().includes(el))) {
      message.react(roboReacts[Math.floor(Math.random() * roboReacts.length)]);
    }
  },
};
