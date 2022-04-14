import { Message } from "discord.js";
import { sendMessage } from "./message";
import { delay, getRandomEmoji } from "./util";

import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cb = require("cleverbot");
const cleverbot = new cb({
  key: process.env.CLEVERBOT_KEY,
});

const defaultResponses = [
  "i'm robo-baby",
  "no",
  "what?",
  "can you repeat that?",
  "i don't understand",
];

export async function roboChat(message: Message): Promise<void> {
  if (
    message.channel.id != process.env.SPAM_CHANNEL ||
    !message.mentions.users.has(message.client.user?.id || "")
  )
    return;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "🙂";
  input = input.trim();

  const contextKey = `robochat.${message.author.id}.context`;
  let context = db.get(contextKey) || "";
  let output: string =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  await cleverbot
    .query(input, { cs: context })
    .then((res: any) => {
      output = res.output;
      context = res.cs;
    })
    .catch(console.log);

  // format output
  output = output.toLowerCase();
  if (output.endsWith(".") && !output.endsWith("..."))
    output = output.slice(0, -1);
  if (output.includes("cleverbot")) output.replace("cleverbot", "robo-baby");

  // duplication punctuation
  ["?", "!"].forEach((punctuation) => {
    while (Math.random() < 0.33 && output.endsWith(punctuation)) {
      output += punctuation;
    }
  });

  // update context
  db.set(contextKey, context);

  // add emojis sometimes
  if (Math.random() < 0.1) {
    output = `${output} ${getRandomEmoji(message.guild)}`;
  }

  // respond
  await sendMessage(message, output, 1500);
}
