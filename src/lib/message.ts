import { Message, MessageEmbed, Permissions, Util } from "discord.js";
import { delay } from "./util";
require("dotenv").config();

const cleverbot = require("cleverbot-free");
const db = require("quick.db");

const defaultResponses = ["i'm robo-baby", "no", "what?", "can you repeat that?", "i don't understand", "🙂", "😏", "🤨"];
let lastResponse = 0;

export const removeInvites = (message: Message) => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    message.member?.send("Don't send invite links to other servers. If you must, send them to the interested users directly.");
  }
};

export async function roboChat(message: Message) {
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.mentions.users.has(message.client.user?.id || "")) return;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "what do you think of this?";
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

  // add context
  context.push(input);
  context.push(output);
  context = context.slice(-4);
  db.set(contextKey, context);

  // start typing
  message.channel.sendTyping();
  await delay(Math.random() * 500 + 500 + output.length * 40);

  // respond
  message.reply(output);
}
