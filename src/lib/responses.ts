import { Message } from "discord.js";
import { SendMessage } from "./message";
import { RemovePunctuation } from "./util";
import { IPhraseIO, responsePhrases } from "./data/phrases";

export const RespondToMessage = async (message: Message): Promise<void> => {
  if (message.channel.type != "GUILD_TEXT" || message.channel.parentId === process.env.CATEGORY_MODDING) return;

  const text = RemovePunctuation(` ${message.content.toLowerCase()} `);
  responsePhrases.forEach(async (pr: IPhraseIO) => {
    pr.input.forEach(async (phrase: string) => {
      if (text.includes(` ${phrase} `)) {
        SendMessage(message, pr.output[Math.floor(Math.random() * pr.output.length)], 1000).catch(console.log);
        return;
      }
    });
  });
};
