import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { redis } from "../lib/redis";
import { LogEvent } from "../lib/log";
import { botColor } from "../lib/util";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("[MODERATOR] Apply a warning to a member.")
    .setDefaultPermission(false)
    .addUserOption((option) => option.setName("target").setDescription("The member to warn.").setRequired(true))
    .addStringOption((option) => option.setName("message").setDescription("ID of the offending message.").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for the warning.").setRequired(true))
    .addBooleanOption((option) => option.setName("punish").setDescription("Whether or not to apply the associated punishment.").setRequired(true)),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const messageIdData = interaction.options.getString("message")?.split("-");

    // validate
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
    if (target.roles.cache.has(process.env.ROLE_MOD as string)) {
      interaction.reply({
        content: `You don't have permission to warn ${target}.`,
        ephemeral: true,
      });
      return;
    }

    // validate offending message
    if (messageIdData?.length != 2) {
      interaction.reply({
        content: "Invalid message ID format. Use the format `CHANNELID-MESSAGEID`.\nYou can obtain this by holding shift and clicking the **Copy ID** button.",
        ephemeral: true,
      });
      return;
    }
    const offendingChannel = (await interaction.client.channels.fetch(messageIdData[0])) as TextChannel;
    const offendingMessage = await offendingChannel?.messages.fetch(messageIdData[1]);
    if (!offendingMessage) {
      interaction.reply({ content: "Couldn't find the offending message in this channel.", ephemeral: true });
      return;
    }
    if (offendingMessage.author.id != target.id) {
      interaction.reply({ content: "The specified message does not belong to the user you are warning.", ephemeral: true });
      return;
    }

    const messageEmbed = new MessageEmbed();
    messageEmbed
      .setAuthor({ name: `The offending message in #${offendingChannel.name}:`, iconURL: target.user.displayAvatarURL() })
      .setDescription(`**${target.displayName}:** ${offendingMessage.content}\n\n[View message](${offendingMessage.url})`)
      .setColor(target.displayColor);

    // apply punishments
    const warnings = parseInt((await redis.get(`warnings:${target.id}`)) || "0") + 1;
    const applyPunishment = interaction.options.getBoolean("punish");
    if (applyPunishment) {
      switch (warnings) {
        case 1:
          target.timeout(1000 * 60 * 60, "Warning #1");
          break;
        case 2:
          target.timeout(1000 * 60 * 60 * 24, "Warning #2");
          break;
        case 3:
          target.timeout(1000 * 60 * 60 * 24 * 3, "Warning #3");
          break;
        case 4:
          target.ban({ days: 0, reason: "Warning #4" });
          redis.set(`warnings:${target.id}`, 0);
          break;
      }
    }

    // publicly shame
    const warningEmbed = new MessageEmbed()
      .setAuthor({
        name: `${member.displayName} warned ${target.displayName}`,
        iconURL: member.displayAvatarURL(),
      })
      .setTitle(`Reason: \`${reason}\``)
      .setColor(botColor);
    await offendingMessage.reply({ embeds: [warningEmbed] });
    interaction.reply({ content: `Warned ${target}.`, ephemeral: true });

    // alert target
    const alertEmbed = new MessageEmbed()
      .setAuthor({
        name: `${member.displayName} gave you a warning`,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle(`Reason: \`${reason}\``)
      .setDescription(`**Warning:** \`${warnings}/4\`\n\n${applyPunishment ? "A punishment has been applied. " : ""}Please read our rules carefully.`)
      .setColor(botColor);
    target.send({ embeds: [alertEmbed, messageEmbed] }).catch(() => {
      interaction.followUp({ content: "Couldn't DM the user.", ephemeral: true }).catch(console.log);
    });
    redis.set(`warnings:${target.id}`, warnings);

    LogEvent(`${member} warned ${target} for \`${reason}\` (${warnings}/4)`);
  },
};
