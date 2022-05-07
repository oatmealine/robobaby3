import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";
import { pills } from "../lib/data/pills";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");
const cooldown = 1000 * 60 * 60 * 12;

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("💊 Eat a random pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
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
    const embed = new MessageEmbed().setTitle(`${pill.icon} » ${pill.name}`).setColor(botColor);
    if (pill.effect) pill.effect(member);
    interaction.reply({
      embeds: [embed],
      ephemeral: interaction.channel?.id != process.env.CHANNEL_CHAT,
    });
    console.log(`${member.user.tag} ate a pill: ${pill.name}`);
  },
};
