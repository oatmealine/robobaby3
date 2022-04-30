import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { botColor } from "../lib/util";
import { LogEvent } from "../lib/log";

const roles = ["Coder", "Spriter", "Musician", "Designer"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("title")
    .setDescription("👾 Set your modding title.")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Your desired role.")
        .setRequired(true)
        .addChoice("Coder", "Coder")
        .addChoice("Spriter", "Spriter")
        .addChoice("Musician", "Musician")
        .addChoice("Designer", "Designer")
        .addChoice("Clear", "Clear")
    ),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const choice = interaction.options.getString("choice");

    // remove roles
    roles.forEach((col) => {
      const r = member.roles.cache.find((r) => r.name === col);
      if (r) member.roles.remove(r);
    });

    // end if clearing
    if (choice === "Clear") {
      const embed = new MessageEmbed().setColor(botColor).setDescription("You are now a peasant 🙂");
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const role: Role | undefined = member.guild.roles.cache.find((r) => r.name === choice);
    if (!role) return;

    // add role
    member.roles.add(role).catch((e) => console.log(e));

    // response
    const embed = new MessageEmbed().setColor(role.color).setDescription(`You are now a certified **${role}**`);
    interaction.reply({ embeds: [embed], ephemeral: true });
    LogEvent(`**${member}** became a **${role}**`);
    console.log(`${member.user.tag} became a ${role.name}`);
  },
};
