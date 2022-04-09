import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { LogEvent } from "../lib/log";

const roles = ["Coder", "Spriter", "Musician"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("title")
    .setDescription("Set your modding title.")
    .addStringOption((option) => option.setName("choice").setDescription("Your desired role.").setRequired(true).addChoice("Coder", "Coder").addChoice("Spriter", "Spriter").addChoice("Musician", "Musician")),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const role: Role | undefined = member.guild.roles.cache.find((r) => r.name === interaction.options.getString("choice"));

    roles.forEach((col) => {
      const r = member.roles.cache.find((r) => r.name === col);
      if (r) member.roles.remove(r);
    });
    if (role) {
      member.roles.add(role).catch((e) => console.log(e));

      const embed = new MessageEmbed().setColor(role.color).setDescription(`**${member.displayName}** became **${role.name}**`);
      interaction.reply({ embeds: [embed] });
      LogEvent(`**${member}** became **${role.name}**`);
    }
  },
};
