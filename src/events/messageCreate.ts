import { Message } from "discord.js";
import { reacts } from "../lib/reacts";
import { removeInvites } from "../lib/message";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    removeInvites(message);

    // react to messages
    reacts.forEach(({ phrases, reaction }) => {
      if (phrases.some((el) => message.content.toLowerCase().includes(el))) {
        message.react(reaction[Math.floor(Math.random() * reaction.length)]);
      }
    });
  },
};
