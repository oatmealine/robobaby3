import { Message } from "discord.js";
import { PhraseIO, reactionPhrases } from "./data/phrases";
import { delay, getRandomEmoji, removePunctuation } from "./util";

export const reactToMessage = async (message: Message): Promise<void> => {
  if (message.channel.type != "GUILD_TEXT" || message.channel.parentId == process.env.CATEGORY_MODDING) return;

  const text = removePunctuation(` ${message.cleanContent.toLowerCase()} `);

  reactionPhrases.forEach((pr: PhraseIO) => {
    if (Math.random() > (pr.chance || 1)) return;

    if (pr.input.some((el) => text.includes(` ${el} `))) {
      delay(Math.random() * 4000 + 1000).then(() => {
        message.react(pr.output[Math.floor(Math.random() * pr.output.length)]);
      });
      return;
    }
  });

  if (Math.random() < 0.002) message.react(getRandomEmoji(message.guild));
};
