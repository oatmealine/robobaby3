import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { ReportEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder().setName("report").setDescription("Quietly summon a moderator to deal with a problem."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = new MessageEmbed().setColor("#475acf").setDescription(`**The moderators have been alerted.**\nThanks for your report.`);
    interaction.reply({ embeds: [embed], ephemeral: true });

    const modRole: Role | undefined = member.guild.roles.cache.find((r) => r.name === "Moderator");
    if (modRole) ReportEvent(`${modRole}, ${member} used \`/report\` in ${interaction.channel}`);
  },
};
