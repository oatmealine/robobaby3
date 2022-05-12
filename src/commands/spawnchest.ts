import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { chests } from "../lib/data/chests";
import { spawnChest } from "../lib/chest";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawnchest")
    .setDescription("[ADMIN] Force a chest spawn.")
    .setDefaultPermission(false)
    .addStringOption((option) => {
      option.setName("type").setDescription("The type of chest to spawn.").setRequired(true);
      for (const choice of Object.keys(chests)) option.addChoice(choice, choice);
      return option;
    }),

  async execute(interaction: CommandInteraction) {
    const type = interaction.options.getString("type") as string;
    if (!Object.keys(chests).includes(type)) {
      interaction.reply({ content: `Not a real type (possible: ${Object.keys(chests).join(", ")})`, ephemeral: true });
      return;
    }

    spawnChest(interaction.client, type);
    interaction.reply({ content: "Spawned a chest.", ephemeral: true });
  },
};
