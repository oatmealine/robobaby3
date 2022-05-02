import { Message, MessageEmbed, StartThreadOptions } from "discord.js";
import { delay, removeMarkdown, removeUrls } from "./util";

export async function createThreads(msg: Message): Promise<void> {
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

const managePromo = async (msg: Message): Promise<void> => {
  // scanning temp message
  const embed = new MessageEmbed().setTitle("Scanning...").setDescription("Hang on a sec...");
  msg
    .reply({ embeds: [embed] })
    .then(async (reply: Message) => {
      await delay(4000);
      reply.delete();
    })
    .catch(console.log);
  await delay(4000);

  // analyze
  msg.channel.messages
    .fetch(msg.id)
    .then(async (message) => {
      if (message.embeds.length > 0) {
        const embed = message.embeds[0];
        if (!embed.title) return;

        let opts: StartThreadOptions = { name: embed.title, reason: "Unknown link", autoArchiveDuration: "MAX" };

        // this could be regex
        if (embed.url?.includes("steamcommunity.com/workshop/filedetails/") || embed.url?.includes("steamcommunity.com/sharedfiles/filedetails/"))
          opts = { ...opts, name: embed.title.replace("Steam Workshop::", ""), reason: "Steam Workshop thread" };
        else if (embed.url?.includes("moddingofisaac.com/mod/"))
          opts = { ...opts, name: embed.title.replace(" - Modding of Isaac", ""), reason: "Modding of Isaac thread" };

        message.startThread(opts).catch(console.log);
        console.log(`${message.author} started promotion thread ${opts.name}`);
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
};

const manageResources = async (msg: Message): Promise<void> => {
  if (msg.embeds.length == 0 && !msg.content.includes("```") && !msg.content.match(/https?:\/\//)) return;

  let title = msg.cleanContent;
  title = title.split("\n")[0];
  title = title.replace(/```(.|\n)*?```/g, "");
  title = title.replace(/\s+/g, " ");
  title = removeUrls(title);
  title.trim();
  if (title.length == 0 || title.length > 100) title = `${msg.author.username}'s resource`;
  title = removeMarkdown(title);

  msg.startThread({ name: title, autoArchiveDuration: "MAX" }).catch(console.log);
  console.log(`${msg.author} started resources thread ${title}`);
};

const manageRecruit = async (msg: Message): Promise<void> => {
  let title: string = msg.cleanContent;
  title = title.split("\n")[0];
  title = removeUrls(title);
  title = removeMarkdown(title);
  if (title.length == 0 || title.length > 100) title = `${msg.author.username}'s recruitment thread`;

  msg.startThread({ name: title, autoArchiveDuration: "MAX" }).catch(console.log);
  console.log(`${msg.author} started recruit thread ${title}`);
};
