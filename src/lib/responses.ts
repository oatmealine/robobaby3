import { Message } from "discord.js";
import { client } from "../bot";
import { delay } from "./util";
require("dotenv").config();

interface PhraseResponder {
  phrases: Array<string>;
  response: string;
}

export const responses = [
  { phrases: ["crab dancing to chiptune"], response: "https://youtu.be/j_d_4CnuqZQ" },
  { phrases: ["who is robo"], response: "https://youtu.be/QY4AAos0daI" },
  { phrases: ["godmode chant"], response: "It's a mod for pro 😁\nI love god\nI love godmode 😮\nIt's nice mode" },
  { phrases: ["move server", "server move"], response: `There was no longer an active administrator account on the old server. Now that we have one, you can expect new **features**, **new moderators**, and **Robo-Baby 3.0**.` },
];

export async function respondToMessage(message: Message): Promise<void> {
  responses.forEach(async (pr: PhraseResponder) => {
    pr.phrases.forEach(async (phrase: string) => {
      if (message.content.includes(phrase)) {
        await delay(Math.random() * 1000 + 1000);
        message.channel.sendTyping();
        await delay(Math.random() * 750 + 750);
        message.reply(pr.response);
        return;
      }
    });
  });
}
