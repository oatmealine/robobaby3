import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("formatcode")
    .setDescription("🧹 Toggles code formatting for your messages.")
    .addBooleanOption((option) =>
      option
        .setName("toggle")
        .setDescription("Toggles the formatting.")
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const enabled = interaction.options.getBoolean("toggle");

    redis.set(`formattingDisabled:${member.id}`, (!enabled) ? 1 : 0);

    // response
    const embed = new MessageEmbed().setColor(botColor).setDescription(`Code formatting has been turned **${enabled ? "on" : "off"}**.`);
    interaction.reply({ embeds: [embed], ephemeral: true });
    console.log(`${member.user.tag} code formatting: ${enabled}`);
  },
};
