import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { redis } from "../lib/redis";
import { LogEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("[MODERATOR] Apply a warning to a member.")
    .setDefaultPermission(false)
    .addUserOption((option) => option.setName("target").setDescription("The member to warn.").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for the warning.").setRequired(true))
    .addBooleanOption((option) => option.setName("punish").setDescription("Whether or not to apply the associated punishment.").setRequired(true)),

  permissions: { type: "ROLE", id: process.env.MOD_ROLE, permission: true },

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    if (!user) {
      interaction.reply({
        content: "There was an error finding the user. Please try again.",
        ephemeral: true,
      });
      return;
    }

    const target = interaction.guild?.members.cache.get(user.id);
    if (!target) {
      interaction.reply({
        content: `Couldn't find user ${target}.`,
        ephemeral: true,
      });
      return;
    }
    if (target.roles.cache.has(process.env.MOD_ROLE as string)) {
      interaction.reply({
        content: `You don't have permission to warn ${target}.`,
        ephemeral: true,
      });
      return;
    }

    const warnings = parseInt((await redis.get(`warnings:${target.id}`)) || "0") + 1;
    const applyPunishment = interaction.options.getBoolean("punish");
    if (applyPunishment) {
      switch (warnings) {
        case 1:
          target.timeout(1000 * 60, "Warning #1");
          break;
        case 2:
          target.timeout(1000 * 60 * 60, "Warning #2");
          break;
        case 3:
          target.timeout(1000 * 60 * 60 * 24, "Warning #3");
          break;
        case 4:
          target.timeout(1000 * 60 * 60 * 24 * 7, "Warning #4");
          break;
        case 5:
          target.ban({ days: 1, reason: "Warning #5" });
          redis.set(`warnings:${target.id}`, 0);
          break;
      }
    }

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${target.displayName} received a warning`,
        iconURL: target.user.displayAvatarURL(),
      })
      .setTitle(`Reason: \`${reason}\``)
      .setColor("#475acf");
    interaction.reply({ embeds: [embed] });

    embed = new MessageEmbed()
      .setAuthor({
        name: `${member.displayName} gave you a warning`,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle(`Reason: \`${reason}\``)
      .setDescription(`**Warning:** \`${warnings}/5\`\n\nA punishment has been applied. Please read our rules carefully.`)
      .setColor("#475acf");
    target.send({ embeds: [embed] }).catch(() => {
      interaction.followUp({ content: "Couldn't DM the user.", ephemeral: true });
    });
    redis.set(`warnings:${target.id}`, warnings);

    LogEvent(`${member} warned ${target} for \`${reason}\` (${warnings}/5)`);
  },
};
