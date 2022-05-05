import { Message } from "discord.js";
import { sendMessage } from "./message";
import { removePunctuation } from "./util";
import { PhraseIO, responsePhrases } from "./data/phrases";

import * as dotenv from "dotenv";
dotenv.config();

export const respondToMessage = async (message: Message): Promise<void> => {
  const text = removePunctuation(` ${message.content.toLowerCase()} `);

  responsePhrases.forEach(async (pr: PhraseIO) => {
    pr.input.forEach(async (phrase: string) => {
      if (text.includes(` ${phrase} `)) {
        sendMessage(message, pr.output[Math.floor(Math.random() * pr.output.length)], 1000).catch(console.log);
        return;
      }
    });
  });
};
