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
    const imageUrl = imageData.data.link;

    // publish item
    const embed = new MessageEmbed()
      .setTitle(product.name)
      .setDescription(product.description)
      .setFooter({ text: `🪙 ${product.cost}` })
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

  static async GetMemberItems(member: GuildMember) {
    const itemsKey = `items:${member.id}`;
    const memberItems = await redis.lRange(itemsKey, 0, -1);
    return memberItems;
  }
}

export const InitializeItems = (client: Client) => {
  ItemManager.Initialize(client, itemData, [process.env.CHANNEL_SHOP as string]);
};
