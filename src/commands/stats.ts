import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { StatManager } from "../lib/stats";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("🏆 View your or another member's stats.")
    .addUserOption((option) => option.setName("member").setDescription("Member to view the stats of (leave blank for self)")),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const user = interaction.options.getUser("member");
    const target = interaction.guild?.members.cache.get(user?.id || "") || member;

    const embed = await StatManager.GetEmbed(target);
    interaction.reply({ embeds: [embed], ephemeral: true });
    console.log(`${member.user.tag} viewed ${target.user.tag}'s stats`);
  },
};
