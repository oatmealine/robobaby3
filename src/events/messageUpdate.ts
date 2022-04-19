import { Message } from "discord.js";
import { LogEvent } from "../lib/log";
import { removeInvites } from "../lib/message";

import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Diff = require("diff");

module.exports = {
  name: "messageUpdate",
  once: false,

  async execute(oldMessage: Message, newMessage: Message) {
    if (newMessage.author.bot || newMessage.member?.roles.cache.has(process.env.MOD_ROLE as string)) return;

    removeInvites(newMessage);

    const diff = Diff.diffWords(oldMessage.content.replace(/`/g, ""), newMessage.content.replace(/`/g, ""));
    let output = "";
    diff.forEach((part: any) => {
      output += "\n";
      if (part.added) output += "+ ";
      if (part.removed) output += "- ";
      output += part.value;
    });
    const diffMsg = `\`\`\`diff\n${output}\`\`\``;

    LogEvent(`${newMessage.author}'s message edited in ${newMessage.channel}:${diffMsg}`);
    console.log(`${newMessage.author.tag}'s message edited in ${newMessage.channel}:${output}`);
  },
};
