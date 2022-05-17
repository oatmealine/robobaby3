import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { CooldownManager } from "./cooldown";
import { redis } from "./redis";

const confirmationTimeout = 1000 * 60;
const cd = new CooldownManager("modmail", 1000 * 60 * 5);

export const HandleModMail = async (message: Message) => {
  const embed = new MessageEmbed()
    .setAuthor({ name: `Modmail from ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setDescription(message.content);

  // validate
  const guild = message.client.guilds.cache.get(process.env.GUILD_ID as string);
  if (!guild) return;

  const member = await guild.members.fetch(message.author.id);
  if (!member) return;

  const channel = guild.channels.cache.get(process.env.CHANNEL_MOD as string) as TextChannel;
  if (!channel) return;

  const blocked = await redis.lRange("modmail:blocked", 0, -1);
  if (blocked.includes(message.author.id)) return;

  // reply
  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("yes").setLabel("Yes").setStyle("SUCCESS"),
    new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER")
  );
  const queryMsg = (await message
    .reply({ content: "Would you like me to forward this message to the **Modding of Isaac** moderators?", components: [row] })
    .catch(console.log)) as Message;

  // collect response
  const collector = message.channel.createMessageComponentCollector({ time: confirmationTimeout });
  collector.on("collect", async (i) => {
    if (i.customId === "yes") {
      if ((await cd.GetRemainingTime(member)) > 0) {
        message.reply("You're doing that too much. Try again in a few minutes.");
        return;
      }

      cd.Trigger(member);
      queryMsg.react("👍").catch(console.log);

      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId(`mm-block-${message.author.id}`).setLabel("Block this user from sending modmail").setStyle("DANGER")
      );
      queryMsg.edit({ components: [] });

      const modmail = (await channel.send({ embeds: [embed], components: [row] }).catch(console.log)) as Message;
      ModmailCollector(modmail);
      console.log(`Modmail sent from ${message.author.tag}`);
    } else queryMsg.delete();
    collector.stop();
  });

  // remove buttons if idle
  setTimeout(() => {
    if (queryMsg) queryMsg.edit({ components: [] });
  }, confirmationTimeout);
};

const ModmailCollector = (message: Message) => {
  const collector = message.channel.createMessageComponentCollector({
    filter: (i) => i.customId.startsWith("mm-block"),
  });
  collector.on("collect", async (i) => {
    const memberId = i.customId.split("-")[2];
    redis.rPush("modmail:blocked", memberId);
    message.reply(`${i.member} blocked this user from sending modmail`);

    message.edit({ components: [] });
    collector.stop();
  });
};
