import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { ReportEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Quietly summon a moderator to deal with a problem."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = new MessageEmbed()
      .setColor("#475acf")
      .setTitle("**The moderators have been alerted.**")
      .setDescription("Thanks for your report.");
    interaction.reply({ embeds: [embed], ephemeral: true });

    ReportEvent(
      member.guild,
      `${member} used \`/report\` in ${interaction.channel}`
    );
    console.log(`${member.user.tag} used /report in ${interaction.channel}.`);
  },
};
