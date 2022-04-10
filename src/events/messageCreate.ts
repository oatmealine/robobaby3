import { Message } from "discord.js";
import { reacts } from "../lib/reacts";
import { removeInvites, respondToMessage } from "../lib/message";

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot) return;

    removeInvites(message);

    // react to messages
    reacts.forEach(({ phrases, reaction }) => {
      if (phrases.some((el) => message.content.toLowerCase().includes(el))) {
        message.react(reaction[Math.floor(Math.random() * reaction.length)]);
      }
    });

    // respond if mentioned
    if (message.channel.id == process.env.SPAM_CHANNEL && message.mentions.users.has(message.client.user?.id || "")) {
      respondToMessage(message);
    }
  },
};
