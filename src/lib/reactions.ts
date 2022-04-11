import { Message } from "discord.js";
import { delay } from "./util";

interface PhraseReactor {
  phrases: string[];
  reaction: string[];
  chance: number;
}

export const reacts = [
  { phrases: ["robo", "baby", "robobaby"], reaction: ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😴", "😵", "😶"], chance: 0.5 },
  { phrases: ["butt"], reaction: ["🍑"], chance: 1 },
  { phrases: ["gay", "homo"], reaction: ["🏳️‍🌈"], chance: 0.5 },
];

export async function reactToMessage(message: Message): Promise<void> {
  if (message.channel.id == process.env.SPAM_CHANNEL) return;

  await delay(Math.random() * 4000 + 1000);
  reacts.forEach((pr: PhraseReactor) => {
    if (Math.random() > pr.chance) return;

    if (pr.phrases.some((el) => ` ${message.cleanContent.toLowerCase()} `.includes(` ${el} `))) {
      message.react(pr.reaction[Math.floor(Math.random() * pr.reaction.length)]);
    }
  });
}
