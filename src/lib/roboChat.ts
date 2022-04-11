import { Message } from "discord.js";
import { delay, getRandomEmoji } from "./util";

const cleverbot = require("cleverbot-free");
const db = require("quick.db");

const defaultResponses = ["i'm robo-baby", "no", "what?", "can you repeat that?", "i don't understand"];
let lastResponse = 0;

export async function roboChat(message: Message): Promise<void> {
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.mentions.users.has(message.client.user?.id || "")) return;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "🙂";
  input = input.trim();

  // query cleverbot
  const contextKey = `robochat.${message.author.id}.context`;
  let context = db.get(contextKey) || [];

  let output: string = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
  if (output.endsWith(".") && !output.endsWith("...")) output = output.slice(0, -1);

  // update context
  context = [...context, input, output];
  context = context.slice(-4);
  db.set(contextKey, context);

  // start typing
  await delay(Math.random() * 500 + 500);
  message.channel.sendTyping();
  await delay(Math.random() * 500 + output.length * 30);

  // respond
  message.reply(output);

  // add emojis sometimes
  if (Math.random() < 0.1) {
    const emoji = getRandomEmoji(message.guild);
    await delay(Math.random() * 250 + 250);
    message.channel.sendTyping();
    await delay(Math.random() * 250 + 250);
    message.channel.send(`${emoji}`);
  }
}
