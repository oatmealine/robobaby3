import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";
import { GetRandomPill } from "../lib/data/pills";
import { MemberStats } from "../lib/data/stats";
import { AdjustMemberStat, GetMemberStatsEmbed, StatChange } from "../lib/memberStats";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");
const cooldown = 1000 * 60 * 60 * 12;

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("💊 Eat a random pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const isChatChannel = interaction.channel?.id == process.env.CHANNEL_CHAT;

    // cooldown
    const timeKey = `pill:${member.id}`;
    if ((await redis.exists(timeKey)) && process.env.NODE_ENV !== "development") {
      const lastUsed = parseInt((await redis.get(timeKey)) || "0");
      const elapsed = interaction.createdTimestamp - lastUsed;
      if (elapsed < cooldown) {
        const minutes = Math.floor((cooldown - elapsed) / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const left = hours > 1 ? `${hours} ${pluralize("hour", hours)}` : `${minutes} ${pluralize("minute", minutes)}`;

        interaction.reply({
          content: `You can have another one in \`${left}\`.`,
          ephemeral: true,
        });
        return;
      }
    }
    redis.set(timeKey, interaction.createdTimestamp);

    // eat pill
    const pill = GetRandomPill();
    let affectedStats: Array<StatChange> = [];
    if (pill.effect) {
      const change = await pill.effect(member);
      if (Array.isArray(change)) affectedStats = change;
    }
    await AdjustMemberStat(member, "pills", 1);

    // pill embed
    const title = `${pill.icon} » ${pill.name}`;
    const desc = `${pill.description || ""}${
      affectedStats.length > 0 ? `\n\n${affectedStats.map((s) => `> **${MemberStats[s.stat].name}:** ${s.value > 0 ? "🔺" : "🔻"}`).join("\n")}` : ""
    }`;
    const pillEmbed = new MessageEmbed().setTitle(title).setDescription(desc).setColor(botColor);

    // stats button
    const statsEmbed = await GetMemberStatsEmbed(member);
    const row = new MessageActionRow();

    if (isChatChannel) {
      const button = new MessageButton().setCustomId(member.id).setLabel(`View ${member.displayName}'s stats`).setStyle("SECONDARY");
      row.addComponents(button);
    }

    // response
    await interaction.reply({
      embeds: [pillEmbed],
      components: row.components.length > 0 ? [row] : [],
      ephemeral: !isChatChannel,
    });
    interaction.followUp({ embeds: [statsEmbed], ephemeral: true });
    console.log(`${member.user.tag} ate a pill: ${pill.name}`);
  },
};
