import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { GetRandomPill } from "../lib/data/pills";
import { statData } from "../lib/data/stats";
import { CooldownManager } from "../lib/cooldown";
import { IStatChange, StatManager } from "../lib/statManager";
import { ItemManager } from "../lib/itemManager";
import { Statistics } from "../lib/statistics";

const pillCd = new CooldownManager("pill", 1000 * 60 * 60 * 10);

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("💊 Eat a random pill. (Cooldown: 10 hours)"),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const isChatChannel = interaction.channel?.id === process.env.CHANNEL_CHAT;

    // cooldown
    const remaining = await pillCd.GetRemainingTime(member);
    if (remaining > 0) {
      interaction.reply({
        content: `You can have another one in **${pillCd.GetTimeString(remaining)}**.`,
        ephemeral: true,
      });
      return;
    }
    pillCd.Trigger(member);

    // eat pill
    const pill = GetRandomPill(await ItemManager.HasItem(member, "phd"));
    let affectedStats: Array<IStatChange> = [];
    if (pill.effect) {
      const change = await pill.effect(member);
      if (Array.isArray(change)) affectedStats = change;
    }
    await StatManager.AdjustStat(member, "pills", 1);

    // pill embed
    const title = `${pill.icon} » ${pill.name}`;
    const desc = `${pill.description || ""}${
      affectedStats.length > 0 ? `\n\n${affectedStats.map((s) => `> **${statData[s.stat].name}:** ${s.value > 0 ? "🔺" : "🔻"}`).join("\n")}` : ""
    }`;
    const pillEmbed = new MessageEmbed().setTitle(title).setDescription(desc).setColor(botColor);

    // stats button
    const statsEmbed = await StatManager.GetEmbed(member);
    const row = new MessageActionRow();

    if (isChatChannel) {
      const button = StatManager.CreateButton(member.id, "view", "View Stats", "SECONDARY", "🔭");
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
    Statistics.Increment({ category: ["pills", "consumed"] });
  },
};
