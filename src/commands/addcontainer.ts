import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, TextChannel } from "discord.js";
import { ContainerManager } from "../lib/containerManager";
import { containerData } from "../lib/data/containers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcontainer")
    .setDescription("[ADMIN] Force a container spawn.")
    .setDefaultPermission(false)
    .addStringOption((option) => {
      option.setName("type").setDescription("The type of container to spawn.").setRequired(true);
      for (const choice of Object.keys(containerData)) option.addChoice(choice, choice);
      return option;
    })
    .addChannelOption((option) => option.setName("channel").setDescription("The channel to spawn the container in.").setRequired(true)),

  async execute(interaction: CommandInteraction) {
    const type = interaction.options.getString("type") as string;
    const channel = interaction.options.getChannel("channel") as TextChannel;

    ContainerManager.Create(channel, type);
    interaction.reply({ content: "Spawned a container.", ephemeral: true });
  },
};
