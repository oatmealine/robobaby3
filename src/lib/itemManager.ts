import { ButtonInteraction, Client, ColorResolvable, GuildMember, MessageActionRow, MessageEmbed, TextChannel } from "discord.js";
import { itemData } from "./data/items";
import { imgur } from "./imgur";
import { InteractiveElementManager } from "./interactiveElement";
import { LogEvent } from "./log";
import { StatManager } from "./statManager";
import { redis } from "./redis";

export class ItemManager extends InteractiveElementManager {
  protected static elementName = "item";

  static async Create(channel: TextChannel, id: string) {
    const product = itemData[id];

    // create thumbnail
    const tempMsg = await channel.send({ files: [`./images/items/${id}.png`] });
    const tempUrl = tempMsg.attachments.first()?.url as string;
    tempMsg.delete();

    const imageData = await imgur.upload({ image: tempUrl, type: "url" });
    if (!imageData.success) return;
    const imageUrl = imageData.data.link;

    const footer = `🪙 ${product.cost}${!product.unique ? " • ♾️" : ""}`;

    // publish item
    const embed = new MessageEmbed()
      .setTitle(product.name)
      .setDescription(product.description)
      .setFooter({ text: footer })
      .setThumbnail(imageUrl)
      .setColor(product.color as ColorResolvable);
    const row = new MessageActionRow().addComponents(ItemManager.CreateButton(id, "buy", `Purchase ${product.name}`, "SUCCESS"));
    channel.send({ embeds: [embed], components: [row] });
  }
  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const item = itemData[id];
    if (!item) return;

    const member = i.member as GuildMember;
    const imageFiles = [`./images/items/${id}.png`];

    // validate
    const itemsKey = `items:${member.id}`;
    if (item.unique) {
      const memberItems = await redis.lRange(itemsKey, 0, -1);
      if (memberItems.includes(id)) {
        i.reply({ content: `You already own **${item.name}**.`, files: imageFiles, ephemeral: true });
        console.log(`${member.user.tag} already owns ${item.name}`);
        return;
      }
    }
    const coins = await StatManager.GetStat(member, "coins");
    if (coins < item.cost) {
      const statsEmbed = await StatManager.GetEmbed(member, ["coins"]);
      i.reply({ content: `You can't afford **${item.name}**.`, files: imageFiles, embeds: [statsEmbed], ephemeral: true });
      console.log(`${member.user.tag} can't afford item ${item.name}`);
      return;
    }

    // complete purchase
    await StatManager.AdjustStat(member, "coins", -item.cost);
    await item.effect(member).catch(console.log);
    if (item.unique) redis.rPush(itemsKey, id);

    // response
    const statsEmbed = await StatManager.GetEmbed(member, ["coins"]);
    i.reply({ content: "Purchased!", embeds: [statsEmbed], files: imageFiles, ephemeral: true });

    LogEvent(`${member} purchased ${item.name}`);
    console.log(`${member.user.tag} purchased ${item.name}`);
  }

  static async GetItems(member: GuildMember) {
    const items = await redis.lRange(`items:${member.id}`, 0, -1);
    return items;
  }

  static async HasItem(member: GuildMember, itemId: string) {
    const items = await this.GetItems(member);
    return items.includes(itemId);
  }

  static RemoveItem(member: GuildMember, itemId: string) {
    redis.lRem(`items:${member.id}`, 0, itemId);
  }
}

export const InitializeItems = (client: Client) => {
  ItemManager.Initialize(client, itemData, [process.env.CHANNEL_SHOP as string]);
};
