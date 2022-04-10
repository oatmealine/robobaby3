import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { ReportEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder().setName("goldengod").setDescription("Request the Golden God role for dedicated members of the old server."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = new MessageEmbed().setColor("#475acf").setDescription(`**Your request has been sent for review.**\nIf you were an \`Angel\`, \`Demon\`, or \`Golden God\` on the old server, you will be granted the role.`);
    interaction.reply({ embeds: [embed], ephemeral: true });

    const modRole: Role | undefined = member.guild.roles.cache.find((r) => r.name === "Moderator");
    if (modRole) ReportEvent(`${modRole}, ${member} requested the Golden God role`);
  },
};
