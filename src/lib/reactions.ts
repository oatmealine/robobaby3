import { Message } from "discord.js";
import { delay } from "./util";

interface PhraseReactor {
  phrases: string[];
  reaction: string[];
  chance?: number;
}

export const reactions: Array<PhraseReactor> = [
  {
    phrases: ["robobaby", "robo-baby"],
    reaction: ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😶"],
    chance: 0.5,
  },
  { phrases: ["butt"], reaction: ["🍑"] },
  { phrases: ["crab"], reaction: ["🦀"] },
  { phrases: ["should i", "am i", "can i"], reaction: ["👍", "👎"] },
];

export const reactToMessage = async (message: Message): Promise<void> => {
  if (message.channel.id == process.env.CHANNEL_CHAT) return;

  await delay(Math.random() * 4000 + 1000);
  reactions.forEach((pr: PhraseReactor) => {
    if (Math.random() > (pr.chance || 1)) return;

    if (pr.phrases.some((el) => ` ${message.cleanContent.toLowerCase()} `.includes(` ${el} `))) {
      message.react(pr.reaction[Math.floor(Math.random() * pr.reaction.length)]);
    }
  });
};
