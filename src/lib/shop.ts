import { ButtonInteraction, Client, ColorResolvable, GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { items } from "./data/items";
import { LogEvent } from "./log";
import { AdjustMemberStat, GetMemberStat, GetMemberStatsEmbed } from "./memberStats";
import { redis } from "./redis";

export const initializeShop = (client: Client) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_SHOP as string) as TextChannel;
  if (!channel) return;

  const collector = channel.createMessageComponentCollector({ filter: (i) => i.customId.startsWith("buy-") });
  collector.on("collect", (i) => buyProduct(i as ButtonInteraction));
};

export const addProduct = async (client: Client, productName: string) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_SHOP as string) as TextChannel;
  if (!channel) return;

  const product = items[productName];

  const imageMsg = await channel.send({ files: [`./images/items/${productName}.png`] });
  const imageUrl = imageMsg.attachments.first()?.url as string;
  imageMsg.delete();

  const embed = new MessageEmbed()
    .setTitle(product.name)
    .setDescription(product.description)
    .setFooter({ text: `🪙 ${product.cost}` })
    .setThumbnail(imageUrl)
    .setColor(product.color as ColorResolvable);
  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId(`buy-${productName}`).setLabel(`Purchase ${product.name}`).setStyle("SUCCESS")
  );
  channel.send({ embeds: [embed], components: [row] });
};

const buyProduct = async (interaction: ButtonInteraction) => {
  const productId = interaction.customId.split("-")[1];
  const product = items[productId];
  if (!product) return;

  const member = interaction.member as GuildMember;
  const imageFiles = [`./images/items/${productId}.png`];

  // validate
  const itemsKey = `items:${member.id}`;
  const memberItems = await redis.lRange(itemsKey, 0, -1);
  if (memberItems.includes(productId)) {
    interaction.reply({ content: `You already own **${product.name}**.`, files: imageFiles, ephemeral: true });
    console.log(`${member.user.tag} already owns ${product.name}`);
    return;
  }
  const coins = await GetMemberStat(member, "coins");
  if (coins < product.cost) {
    const statsEmbed = await GetMemberStatsEmbed(member, ["coins"]);
    interaction.reply({ content: `You can't afford **${product.name}**.`, files: imageFiles, embeds: [statsEmbed], ephemeral: true });
    console.log(`${member.user.tag} can't afford ${product.name}`);
    return;
  }

  // complete purchase
  await AdjustMemberStat(member, "coins", -product.cost);
  await product.effect(member).catch(console.log);
  redis.rPush(itemsKey, productId);

  // response
  const statsEmbed = await GetMemberStatsEmbed(member, ["coins"]);
  interaction.reply({ content: "Purchased!", embeds: [statsEmbed], files: imageFiles, ephemeral: true });

  LogEvent(`${member} purchased ${product.name}`);
  console.log(`${member.user.tag} purchased ${product.name}`);
};
