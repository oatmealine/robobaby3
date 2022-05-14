import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ContainerManager } from "../lib/containerManager";

module.exports = {
  data: new SlashCommandBuilder().setName("addcontainerbatch").setDescription("[ADMIN] Force a container batch spawn.").setDefaultPermission(false),

  async execute(interaction: CommandInteraction) {
    ContainerManager.CreateBatch(interaction.client, Math.ceil(Math.random() * 5));
    interaction.reply({ content: "Spawned a container batch.", ephemeral: true });
  },
};
