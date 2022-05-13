import { Message } from "discord.js";
import { IPhraseIO, reactionPhrases } from "./data/phrases";
import { Delay, GetRandomEmoji, RemovePunctuation } from "./util";

export const ReactToMessage = async (message: Message): Promise<void> => {
  if (message.channel.type != "GUILD_TEXT" || message.channel.parentId === process.env.CATEGORY_MODDING) return;

  const text = RemovePunctuation(` ${message.cleanContent.toLowerCase()} `);
  reactionPhrases.forEach((pr: IPhraseIO) => {
    if (Math.random() > (pr.chance || 1)) return;

    if (pr.input.some((el) => text.includes(` ${el} `))) {
      Delay(Math.random() * 4000 + 1000).then(() => {
        message.react(pr.output[Math.floor(Math.random() * pr.output.length)]);
      });
      return;
    }
  });

  if (Math.random() < 0.002) message.react(GetRandomEmoji(message.guild));
};
