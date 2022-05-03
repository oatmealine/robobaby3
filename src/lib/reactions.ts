import { Message } from "discord.js";
import { delay } from "./util";

interface PhraseReactor {
  phrases: string[];
  reaction: string[];
  chance: number;
}

export const reacts = [
  {
    phrases: ["robobaby", "robo-baby"],
    reaction: [
      "😉",
      "😍",
      "😘",
      "😜",
      "😝",
      "😎",
      "😏",
      "😒",
      "😓",
      "😔",
      "😖",
      "😞",
      "😣",
      "😢",
      "😭",
      "😨",
      "😩",
      "😫",
      "😬",
      "😰",
      "😱",
      "😲",
      "😳",
      "😴",
      "😵",
      "😶",
    ],
    chance: 0.5,
  },
  { phrases: ["butt"], reaction: ["🍑"], chance: 1 },
];

export const reactToMessage = async (message: Message): Promise<void> => {
  if (message.channel.id == process.env.CHANNEL_CHAT) return;

  await delay(Math.random() * 4000 + 1000);
  reacts.forEach((pr: PhraseReactor) => {
    if (Math.random() > pr.chance) return;

    if (pr.phrases.some((el) => ` ${message.cleanContent.toLowerCase()} `.includes(` ${el} `))) {
      message.react(pr.reaction[Math.floor(Math.random() * pr.reaction.length)]);
    }
  });
};
