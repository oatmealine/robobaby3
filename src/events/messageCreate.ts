import { Message } from "discord.js";
import { reacts } from "../lib/reacts";
import { removeInvites, respondToMessage } from "../lib/message";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    removeInvites(message);

    // respond if mentioned
    if (message.channel.id == process.env.SPAM_CHANNEL && message.mentions.users.has(message.client.user?.id || "")) {
      respondToMessage(message);
    }

    // react to messages
    await new Promise((r) => setTimeout(r, Math.random() * 4000 + 1000));
    reacts.forEach(({ phrases, reaction }) => {
      if (phrases.some((el) => message.content.toLowerCase().includes(el))) {
        message.react(reaction[Math.floor(Math.random() * reaction.length)]);
      }
    });
  },
};
