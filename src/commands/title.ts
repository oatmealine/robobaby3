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
    if (!role) return;

    // check has role
    if (member.roles.cache.has(role.id)) {
      interaction.reply({ content: `\`You are already a ${role.name}\``, ephemeral: true });
      return;
    }

    // remove other roles
    roles.forEach((col) => {
      const r = member.roles.cache.find((r) => r.name === col);
      if (r) member.roles.remove(r);
    });

    // add role
    member.roles.add(role).catch((e) => console.log(e));

    // response
    const embed = new MessageEmbed().setColor(role.color).setDescription(`You are now a certified **${role}**`);
    interaction.reply({ embeds: [embed], ephemeral: true });
    LogEvent(`**${member}** became a **${role}**`);
  },
};
