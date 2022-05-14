import { GuildMember, Message } from "discord.js";
import { SendMessage } from "./message";
import { Delay, GetRandomEmoji, RemoveMarkdown } from "./util";
import { redis } from "./redis";

import vision from "@google-cloud/vision";
import { CooldownManager } from "./cooldown";
const visionClient = new vision.ImageAnnotatorClient();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cb = require("cleverbot");
const cleverbot = new cb({
  key: process.env.CLEVERBOT_KEY,
});

const cd = new CooldownManager("robochat", 1000 * 4);
const defaultResponses = ["i'm robo-baby", "no", "what?", "?", "i don't understand", "ok", "okay", "sure", "nice", "lol", "wow", "lmao", "same", "k", "ty"];

export const RoboChat = async (message: Message) => {
  if (message.channel.id != process.env.CHANNEL_CHAT || !message.mentions.users.has(message.client.user?.id || "")) return;

  // format input
  let input = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "🙂";
  input = input.trim();
  input = RemoveMarkdown(input);

  // replace images with text
  input = await ConvertImagesToText(input, message);

  // run cleverbot
  let output: string = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

  const cdLeft = await cd.GetRemainingTime(message.member as GuildMember);
  if (cdLeft <= 0) {
    const contextKey = `robochat:context:${message.author.id}`;
    const context = cdLeft > -1000 * 60 * 60 ? (await redis.get(contextKey)) || "" : "";
    cd.Trigger(message.member as GuildMember);

    const res = await cleverbot.query(input, { cs: context }).catch(console.log);
    if (res) {
      output = res.output.toLowerCase();
      if (output.endsWith(".") && !output.endsWith("...")) output = output.slice(0, -1);
      if (output.includes("cleverbot")) output = output.replace("cleverbot", "robo-baby");

      redis.set(contextKey, res.cs);
    }
  }

  // duplication punctuation
  ["?", "!"].forEach((punctuation) => {
    while (Math.random() < 0.2 && output.endsWith(punctuation)) {
      output += punctuation;
    }
  });

  // add emojis sometimes
  if (Math.random() < 0.1) output = `${output} ${GetRandomEmoji(message.guild)}`;

  // respond
  SendMessage(message, output, 1500);
};

const ConvertImagesToText = async (text: string, message: Message) => {
  await Delay(1000);
  await message.channel.messages
    .fetch(message.id)
    .then(async (msg) => {
      await Promise.all(
        msg.embeds.map(async (embed) => {
          if (embed.image) {
            const [result] = await visionClient.labelDetection(embed.image.url);
            const labels: Array<string> = [];
            result.labelAnnotations?.map((label) => labels.push(label.description || ""));
            const description = labels.slice(0, 5).join(", ");
            text = text.replace(embed.image.url, description);
            console.log(`Converted ${embed.image.url} to "${description}"`);
          }
        })
      );
    })
    .catch(console.log);

  return text;
};
