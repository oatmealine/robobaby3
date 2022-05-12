import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { botColor } from "../lib/util";
import { LogEvent } from "../lib/log";

const titles = ["Coder", "Spriter", "Musician", "Designer"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("title")
    .setDescription("👾 Set your modding title.")
    .addStringOption((option) => {
      option.setName("choice").setDescription("Your desired role.").setRequired(true);
      for (const title of titles) option.addChoice(title, title);
      option.addChoice("Clear", "Clear");
      return option;
    }),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const choice = interaction.options.getString("choice");

    // remove roles
    titles.forEach((title) => {
      const r = member.roles.cache.find((r) => r.name === title);
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
