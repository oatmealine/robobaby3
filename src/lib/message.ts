import { Message, MessageEmbed, Permissions, Util } from "discord.js";
import { LogEvent } from "./log";
import { delay } from "./util";
require("dotenv").config();

const cleverbot = require("cleverbot-free");

const defaultResponses = ["i'm robo-baby", "no", "what?", "can you repeat that?", "i don't understand", "🙂", "😏", "🤨"];
let lastResponse = 0;
let context: string[] = [];

export const removeInvites = (message: Message) => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  if (message.content.includes("discord.gg")) {
    message.delete();
    LogEvent(`Invite link from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  }
};

export async function respondToMessage(message: Message) {
  if (message.channel.id != process.env.SPAM_CHANNEL || !message.mentions.users.has(message.client.user?.id || "")) return;

  // format input
  let input: string = message.content;
  input = input.replace(/<@!?[0-9]+>/g, "");
  if (input.length < 2) input = "what do you think of this?";
  input = input.trim();

  // query cleverbot
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

  // start typing
  message.channel.sendTyping();
  await delay(Math.random() * 500 + 500 + output.length * 40);

  // respond
  message.reply(output);
}

export async function createThreads(msg: Message) {
  switch (msg.channel.id) {
    // recruit
    case process.env.RECRUIT_CHANNEL:
      if (msg.mentions.users.size == 0 && msg.mentions.roles.size == 0 && msg.content.length > 0) {
        let title: string = msg.content;
        title = title.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, "");
        msg.startThread({ name: title, autoArchiveDuration: "MAX" }).catch(console.log);
        console.log(`${msg.author} started recruit thread ${title}`);
      } else {
        await msg
          .reply("Please include a simple description and no mentions (links optional).")
          .then((reply: Message) => {
            return delay(10000).then(() => {
              msg.delete();
              reply.delete();
            });
          })
          .catch(console.log);
      }
      break;

    // promo
    case process.env.PROMO_CHANNEL:
      const embed = new MessageEmbed().setTitle("Scanning...").setDescription("Please wait...");
      msg
        .reply({ embeds: [embed] })
        .then(async (reply: Message) => {
          await delay(3000);
          reply.delete();
        })
        .catch(console.log);

      await delay(3000);
      msg.channel.messages
        .fetch(msg.id)
        .then(async (message) => {
          if (message.embeds.length > 0) {
            const embed = message.embeds[0];
            if (!embed.title) return;

            let title = "Error",
              reason = "Error";

            if (embed.url?.includes("steamcommunity.com/workshop/filedetails/") || embed.url?.includes("steamcommunity.com/sharedfiles/filedetails/")) {
              title = embed.title.replace("Steam Workshop::", "");
              reason = "Steam Workshop thread";
            } else if (embed.url?.includes("moddingofisaac.com/mod/")) {
              title = embed.title.replace(" - Modding of Isaac", "");
              reason = "Modding of Isaac thread";
            }
            message.startThread({ name: title, autoArchiveDuration: "MAX", reason: reason }).catch(console.log);
            console.log(`${message.author} started promotion thread ${title}`);
          } else {
            await message
              .reply("Please post a link to a mod you've created on **Steam Workshop** or **Modding of Isaac**.")
              .then((reply: Message) => {
                return delay(10000).then(() => {
                  message.delete();
                  reply.delete();
                });
              })
              .catch(console.log);
          }
        })
        .catch(console.log);
  }
}
