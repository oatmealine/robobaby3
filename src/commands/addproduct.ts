import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { items } from "../lib/data/items";
import { addProduct } from "../lib/shop";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addproduct")
    .setDescription("[ADMIN] Add a product to the shop channel.")
    .setDefaultPermission(false)
    .addStringOption((option) => {
      option.setName("product").setDescription("The product to add.").setRequired(true);
      for (const choice of Object.keys(items)) option.addChoice(choice, choice);
      return option;
    }),

  async execute(interaction: CommandInteraction) {
    const product = interaction.options.getString("product") as string;

    addProduct(interaction.client, product);
    interaction.reply({ content: "Added.", ephemeral: true });
  },
};
