import { TimestampStyles } from "@discordjs/builders";
import { Message, MessageEmbed } from "discord.js";
import { delay, removeUrls } from "./util";

export async function createThreads(msg: Message) {
  switch (msg.channel.id) {
    case process.env.RECRUIT_CHANNEL:
      manageRecruit(msg);
      break;

    case process.env.PROMO_CHANNEL:
      managePromo(msg);
      break;

    case process.env.RESOURCES_CHANNEL:
      manageResources(msg);
      break;
  }
}

async function manageRecruit(msg: Message) {
  let title: string = msg.cleanContent;
  title = removeUrls(title);

  if (title.length > 0) {
    msg.startThread({ name: title, autoArchiveDuration: "MAX" }).catch(console.log);
    console.log(`${msg.author} started recruit thread ${title}`);
  } else {
    await msg
      .reply("Please include a simple description (links optional).")
      .then(async (reply: Message) => {
        await delay(10000);
        msg.delete();
        reply.delete();
      })
      .catch(console.log);
  }
}

async function managePromo(msg: Message) {
  const embed = new MessageEmbed().setTitle("Scanning...").setDescription("Hang on a sec...");
  msg
    .reply({ embeds: [embed] })
    .then(async (reply: Message) => {
      await delay(4000);
      reply.delete();
    })
    .catch(console.log);

  await delay(4000);
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

async function manageResources(msg: Message) {
  let title = msg.cleanContent;
  title = title.replace(/```(.|\n)*?```/g, "");
  title = title.replace(/\n/g, " ");
  title = title.replace(/\s+/g, " ");
  title = removeUrls(title);

  msg.startThread({ name: title, autoArchiveDuration: "MAX" }).catch(console.log);
  console.log(`${msg.author} started resources thread ${title}`);
}
