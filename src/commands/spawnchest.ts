import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, TextChannel } from "discord.js";
import { ChestManager } from "../lib/chest";
import { chests } from "../lib/data/chests";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spawnchest")
    .setDescription("[ADMIN] Force a chest spawn.")
    .setDefaultPermission(false)
    .addStringOption((option) => {
      option.setName("type").setDescription("The type of chest to spawn.").setRequired(true);
      for (const choice of Object.keys(chests)) option.addChoice(choice, choice);
      return option;
    })
    .addChannelOption((option) => option.setName("channel").setDescription("The channel to spawn the chest in.").setRequired(true)),

  async execute(interaction: CommandInteraction) {
    const type = interaction.options.getString("type") as string;
    const channel = interaction.options.getChannel("channel") as TextChannel;

    ChestManager.Create(channel, type);
    interaction.reply({ content: "Spawned a chest.", ephemeral: true });
  },
};
