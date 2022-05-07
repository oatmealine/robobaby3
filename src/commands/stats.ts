import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { GetMemberStatsEmbed } from "../lib/stats";

module.exports = {
  data: new SlashCommandBuilder().setName("stats").setDescription("🏆 View your member stats."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = await GetMemberStatsEmbed(member);
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
