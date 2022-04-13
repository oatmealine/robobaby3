import { Message } from "discord.js";
import { sendMessage } from "./message";
import { delay, getRandomEmoji } from "./util";

import cleverbot from "cleverbot-free";
import db from "quick.db";

const defaultResponses = [
  "i'm robo-baby",
  "no",
  "what?",
  "can you repeat that?",
  "i don't understand",
];
let lastResponse = 0;

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
  input = "You: " + input.trim();

  // query cleverbot
  const contextKey = `robochat.${message.author.id}.context`;
  let context = db.get(contextKey) || [];

  let output: string =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  if (message.createdTimestamp - lastResponse > 2000) {
    await cleverbot(input, context)
      .then((res: string) => {
        output = res;
      })
      .catch(console.log);
    lastResponse = message.createdTimestamp;
  }

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
  context = [...context, input, "Me: " + output];
  context = context.slice(-4);
  db.set(contextKey, context);

  // respond
  sendMessage(message, output, 1500);

  // add emojis sometimes
  if (Math.random() < 0.1) {
    const emoji = getRandomEmoji(message.guild);
    await delay(Math.random() * 250 + 250);
    message.channel.sendTyping();
    await delay(Math.random() * 250 + 250);
    message.channel.send(`${emoji}`);
  }
}
