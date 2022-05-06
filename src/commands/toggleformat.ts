import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("formatcode")
    .setDescription("🧹 Toggles automatic code formatting for your messages.")
    .addBooleanOption((option) => option.setName("state").setDescription("Turn formatting on or off.").setRequired(true)),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const enabled = interaction.options.getBoolean("state");

    redis.set(`formattingDisabled:${member.id}`, !enabled ? 1 : 0);

    // response
    const embed = new MessageEmbed().setColor(botColor).setDescription(`Code formatting has been turned **${enabled ? "on" : "off"}**.`);
    interaction.reply({ embeds: [embed], ephemeral: true });
    console.log(`${member.user.tag} code formatting: ${enabled}`);
  },
};
