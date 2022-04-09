import { GuildMember, Interaction } from "discord.js";
const fs = require("node:fs");

module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, interaction.member as GuildMember);
    } catch (error) {
      await interaction.reply({ content: "`ERROR`", ephemeral: true });
      console.error(error);
    }
  },
};
