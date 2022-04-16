import { Message } from "discord.js";
import { sendMessage } from "./message";
import { delay, getRandomEmoji } from "./util";

import db from "quick.db";

import vision from "@google-cloud/vision";
const visionClient = new vision.ImageAnnotatorClient();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cb = require("cleverbot");
const cleverbot = new cb({
  key: process.env.CLEVERBOT_KEY,
});

const defaultResponses = [
  "i'm robo-baby",
  "no",
  "what?",
  "?",
  "i don't understand",
  "ok",
  "okay",
  "sure",
  "nice",
  "lol",
  "wow",
  "lmao",
  "same",
  "k",
  "ty",
];

export async function roboChat(message: Message): Promise<void> {
  if (
    message.channel.id != process.env.SPAM_CHANNEL ||
    !message.mentions.users.has(message.client.user?.id || "")
  )
    return;

  // format input
  let input = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "🙂";
  input = input.trim();

  // replace images with text
  input = await convertImagesToText(input, message);

  // run cleverbot
  const contextKey = `robochat.${message.author.id}.context`;
  let context = db.get(contextKey) || "";
  let output: string =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  await cleverbot
    .query(input, { cs: context })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    while (Math.random() < 0.2 && output.endsWith(punctuation)) {
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

async function convertImagesToText(text: string, message: Message) {
  await delay(1000);
  await message.channel.messages
    .fetch(message.id)
    .then(async (msg) => {
      await Promise.all(
        msg.embeds.map(async (embed) => {
          if (embed.type == "image" && embed.url) {
            const [result] = await visionClient.labelDetection(embed.url);
            const labels: Array<string> = [];
            result.labelAnnotations?.map((label) =>
              labels.push(label.description || "")
            );
            text = text.replace(embed.url, labels.slice(0, 5).join(", "));
          }
        })
      );
    })
    .catch(console.log);

  console.log(`Converted images to text: ${text}`);
  return text;
}
