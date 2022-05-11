import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { spawnChest } from "../lib/chest";

module.exports = {
  data: new SlashCommandBuilder().setName("spawnchest").setDescription("[ADMIN] Force a chest spawn.").setDefaultPermission(false),

  async execute(interaction: CommandInteraction) {
    spawnChest(interaction.client);
    interaction.reply({ content: "Spawned a chest.", ephemeral: true });
  },
};
