import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";
import { pills } from "../lib/data/pills";
import { MemberStats } from "../lib/data/stats";
import { GetMemberStat } from "../lib/stats";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");
const cooldown = 1000 * 60 * 60 * 12;
const statButtonDuration = 1000 * 60 * 10;

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("💊 Eat a random pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    if (interaction.channel?.id != process.env.CHANNEL_CHAT) {
      const channel = interaction.guild?.channels.cache.find((c) => c.id === process.env.CHANNEL_CHAT);
      interaction.reply({ content: `You can only use this command in ${channel}`, ephemeral: true });
      return;
    }

    // cooldown
    const timeKey = `pill:${member.id}`;
    if ((await redis.exists(timeKey)) && !member.roles.cache.find((r) => r.id == process.env.ROLE_MOD)) {
      const lastUsed = parseInt((await redis.get(timeKey)) || "0");
      const elapsed = interaction.createdTimestamp - lastUsed;
      if (elapsed < cooldown) {
        const minutes = Math.floor((cooldown - elapsed) / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const left =
          hours > 1
            ? `${hours} ${pluralize("hour", hours)} and ${minutes % 60} ${pluralize("minute", minutes % 60)}`
            : `${minutes} ${pluralize("minute", minutes)}`;

        interaction.reply({
          content: `You can have another one in \`${left}\`.`,
          ephemeral: true,
        });
        return;
      }
    }
    redis.set(timeKey, interaction.createdTimestamp);

    // eat pill
    const pill = pills[Math.floor(Math.random() * pills.length)];
    const pillEmbed = new MessageEmbed().setTitle(`${pill.icon} » ${pill.name}`).setColor(botColor);
    if (pill.effect) await pill.effect(member);

    // stats button
    const statsEmbed = new MessageEmbed()
      .setAuthor({ name: `${member.displayName}'s stats`, iconURL: member.user.displayAvatarURL() })
      .setColor(member.displayColor);
    for await (const [name, statData] of Object.entries(MemberStats)) {
      const stat = await GetMemberStat(member, name);
      if (statData.maxValue <= 7) {
        statsEmbed.addField(statData.name, `${"🔵".repeat(stat)}${"⚪".repeat(statData.maxValue - stat)}`, true);
      } else {
        statsEmbed.addField(statData.name, `${stat}`, true);
      }
    }

    const button = new MessageButton().setCustomId(member.id).setLabel("View Stats").setStyle("SECONDARY");
    const collector = interaction.channel?.createMessageComponentCollector({
      time: statButtonDuration,
    });
    collector?.on("collect", async (i) => {
      i.reply({ embeds: [statsEmbed], ephemeral: true }).catch(console.log);
    });
    setTimeout(() => {
      interaction.editReply({ components: [] }).catch(console.log);
    }, statButtonDuration);

    // response
    await interaction.reply({
      embeds: [pillEmbed],
      components: [new MessageActionRow().addComponents(button)],
    });
    interaction.followUp({ embeds: [statsEmbed], ephemeral: true });
    console.log(`${member.user.tag} ate a pill: ${pill.name}`);
  },
};
