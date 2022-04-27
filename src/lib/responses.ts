import { Message } from "discord.js";
import { sendMessage } from "./message";
import { delay } from "./util";

import * as dotenv from "dotenv";
dotenv.config();

interface PhraseResponder {
  phrases: Array<string>;
  response: string;
  removeAfter?: number;
}

export const responses = [
  {
    phrases: ["crab dancing to chiptune"],
    response: "https://youtu.be/j_d_4CnuqZQ",
  },
  { phrases: ["who is robo"], response: "https://youtu.be/QY4AAos0daI" },
  {
    phrases: ["godmode chant"],
    response: "It's a mod for pro 😁\nI love god\nI love godmode 😮\nIt's nice mode",
  },
];

export async function respondToMessage(message: Message): Promise<void> {
  responses.forEach(async (pr: PhraseResponder) => {
    pr.phrases.forEach(async (phrase: string) => {
      if (` ${message.content.toLowerCase()} `.includes(` ${phrase} `)) {
        sendMessage(message, pr.response, 1000)
          .then(async (msg) => {
            if (msg && pr.removeAfter) {
              await delay(pr.removeAfter || 10000);
              msg.delete().catch(console.log);
            }
          })
          .catch(console.log);
        return;
      }
    });
  });
}
