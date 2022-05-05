import { Message } from "discord.js";
import { PhraseIO, reactionPhrases } from "./data/phrases";
import { delay, removePunctuation } from "./util";

export const reactToMessage = async (message: Message): Promise<void> => {
  const text = removePunctuation(` ${message.cleanContent.toLowerCase()} `);
  console.log(text);

  reactionPhrases.forEach((pr: PhraseIO) => {
    if (Math.random() > (pr.chance || 1)) return;

    if (pr.input.some((el) => text.includes(` ${el} `))) {
      delay(Math.random() * 4000 + 1000).then(() => {
        message.react(pr.output[Math.floor(Math.random() * pr.output.length)]);
      });
      return;
    }
  });
};
