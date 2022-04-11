import { Message } from "discord.js";
import { delay } from "./util";

interface PhraseResponder {
  phrase: string;
  response: string;
}

export const responses = [
  { phrase: "crab dancing to chiptune", response: "https://youtu.be/j_d_4CnuqZQ" },
  { phrase: "who is robo", response: "https://youtu.be/QY4AAos0daI" },
  { phrase: "godmode chant", response: "It's a mod for pro 😁\nI love god\nI love godmode 😮\nIt's nice mode" },
];

export async function respondToMessage(message: Message) {
  if (message.channel.id !== process.env.SPAM_CHANNEL) return;

  responses.forEach(async (pr: PhraseResponder) => {
    if (message.content.includes(pr.phrase)) {
      await delay(Math.random() * 2000 + 1000);
      message.channel.sendTyping();
      await delay(Math.random() * 750 + 750);
      message.reply(pr.response);
      return;
    }
  });
}
