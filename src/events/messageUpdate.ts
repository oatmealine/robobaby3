import { Message } from "discord.js";
import { LogEvent } from "../lib/log";
import { removeInvites } from "../lib/message";

module.exports = {
  name: "messageUpdate",
  once: false,

  async execute(oldMessage: Message, newMessage: Message) {
    removeInvites(newMessage);

    LogEvent(`${newMessage.author}'s message edited in ${newMessage.channel}:\n\`\`\`${newMessage.content}\`\`\`to\`\`\`${oldMessage.content}\`\`\``);
    console.log(`${newMessage.author.tag}'s message edited in ${newMessage.channel}\`\`\`${newMessage.content}\`\`\`to\`\`\`${oldMessage.content}\`\`\``);
  },
};
