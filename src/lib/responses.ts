import { Message } from "discord.js";
import { delay } from "./util";

interface PhraseResponder {
  phrase: string;
  response: string;
}

export const responses = [
  { phrase: "crab dancing to chiptune", response: "https://youtu.be/j_d_4CnuqZQ" },
  { phrase: "who is robo", response: "https://youtu.be/QY4AAos0daI" },
];

export async function respondToMessage(message: Message) {
  if (message.channel.id == process.env.SPAM_CHANNEL) return;

  await delay(Math.random() * 2000 + 1000);
  message.channel.sendTyping();
  await delay(Math.random() * 500 + 500);

  responses.forEach((pr: PhraseResponder) => {
    if (message.content.includes(pr.phrase)) {
      message.reply(pr.response);
    }
  });
}
