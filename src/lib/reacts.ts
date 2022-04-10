import { Message } from "discord.js";

export interface PhraseReactor {
  phrases: string[];
  reaction: string[];
  chance: number;
}

export const reacts = [
  { phrases: ["robo", "baby", "robobaby"], reaction: ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😴", "😵", "😶"], chance: 0.5 },
  { phrases: ["butt"], reaction: ["🍑"], chance: 1 },
];

export async function reactToMessage(message: Message) {
  if (message.channel.id == process.env.SPAM_CHANNEL) return;

  await new Promise((r) => setTimeout(r, Math.random() * 4000 + 1000));
  reacts.forEach((pr: PhraseReactor) => {
    if (Math.random() > pr.chance) return;

    if (pr.phrases.some((el) => ` ${message.cleanContent.toLowerCase()} `.includes(` ${el} `))) {
      message.react(pr.reaction[Math.floor(Math.random() * pr.reaction.length)]);
    }
  });
}
