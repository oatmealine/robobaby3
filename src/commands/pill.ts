import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { redis } from "../lib/redis";
import { pills } from "../lib/data/pills";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");
const cooldown = 1000 * 60 * 60;

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("💊 Eat a random pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    // cooldown
    // const timeKey = `pill:${member.id}`;
    // if (await redis.exists(timeKey)) {
    //   const lastUsed = parseInt((await redis.get(timeKey)) || "0");
    //   const elapsed = interaction.createdTimestamp - lastUsed;
    //   if (elapsed < cooldown) {
    //     const seconds = Math.floor((cooldown - elapsed) / 1000);
    //     const minutes = Math.floor(seconds / 60);
    //     const left =
    //       seconds > 60
    //         ? `${minutes} ${pluralize("minute", minutes)} and ${seconds % 60} ${pluralize("second", seconds % 60)}`
    //         : `${seconds} ${pluralize("second", seconds)}`;

    //     interaction.reply({
    //       content: `You can have another one in \`${left}\`.`,
    //       ephemeral: true,
    //     });
    //     return;
    //   }
    // }
    // redis.set(timeKey, interaction.createdTimestamp);

    // eat pill
    const pill = pills[Math.floor(Math.random() * pills.length)];
    const embed = new MessageEmbed().setTitle(pill.icon).setDescription(pill.name).setColor(botColor);
    if (pill.effect) pill.effect(member);
    interaction.reply({
      content: "You ate a pill.",
      embeds: [embed],
      ephemeral: interaction.channel?.id != process.env.CHANNEL_CHAT,
    });
    console.log(`${member.user.tag} ate a ${pill} pill.`);
  },
};
