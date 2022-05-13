import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, TextChannel } from "discord.js";
import { ItemManager } from "../lib/items";
import { itemData } from "../lib/data/items";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addproduct")
    .setDescription("[ADMIN] Add a product to the shop channel.")
    .setDefaultPermission(false)
    .addStringOption((option) => {
      option.setName("product").setDescription("The product to add.").setRequired(true);
      for (const choice of Object.keys(itemData)) option.addChoice(choice, choice);
      return option;
    }),

  async execute(interaction: CommandInteraction) {
    const product = interaction.options.getString("product") as string;
    const channel = interaction.client.channels.cache.get(process.env.CHANNEL_SHOP as string) as TextChannel;

    ItemManager.Create(channel, product);
    interaction.reply({ content: "Added.", ephemeral: true });
  },
};
