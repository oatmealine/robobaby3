import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");

const pills = [
  "🔋 48 Hour Energy",
  "❓ Amnesia",
  "💨 Bad Gas",
  "😈 Bad Trip",
  "💙 Balls of Steel",
  "💣 Bombs Are Key 🔑",
  "💥 Explosive Diarrhea",
  "💖 Full Health",
  "🔽 Health Down",
  "🔼 Health Up",
  "💕 Hematemesis",
  "👀 I Can See Forever",
  "😏 I Found Pills",
  "🍋 Lemon Party",
  "🔽 Luck Down",
  "😐 Paralysis",
  "👃 Pheromones",
  "👦🏼 Puberty",
  "🛡️ Pretty Fly",
  "🔽 Range Down",
  "🔼 Range Up",
  "✨ R U a Wizard?",
  "🔽 Speed Down",
  "🔼 Speed Up",
  "🔽 Tears Down",
  "🔼 Tears Up",
  "🌟 Telepills",
  "🍺 Addicted",
  "🙏 Friends Till The End!",
  "🕷️ Infested!",
  "🕸️ Infested?",
  "◾ One Makes You Small",
  "◼️️ One Makes You Larger",
  "💊 Percs",
  "🕹️ Power Pill",
  "💩 Re-Lax",
  "👾 Retro Vision",
  "🌽 ???",
  "🌞 Feels like I'm walking on sunshine!",
  "🍸 Gulp!",
  "💣 Horf!",
  "😴 I'm Drowsy...",
  "😀 I'm Excited!!!",
  "🤢 Something's wrong...",
  "😩 Vurp!",
  "💩 X-Lax",
  "😷 Experimental Pill",
  "🔽 Shot Speed Down",
  "🔼 Shot Speed Up",
];
const cooldown = 1000 * 60 * 3;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pill")
    .setDescription("💊 Eat a random pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const timeKey = `pill.${member.id}.time`;
    if (db.has(timeKey)) {
      const elapsed = interaction.createdTimestamp - db.get(timeKey);
      if (elapsed < cooldown) {
        const seconds = Math.floor((cooldown - elapsed) / 1000);
        const minutes = Math.floor(seconds / 60);
        const left =
          seconds > 60
            ? `${minutes} ${pluralize("minute", minutes)} and ${
                seconds % 60
              } ${pluralize("second", seconds % 60)}`
            : `${seconds} ${pluralize("second", seconds)}`;

        interaction.reply({
          content: `You can have another one in \`${left}\`.`,
          ephemeral: true,
        });
        return;
      }
    }

    const pill = pills[Math.floor(Math.random() * pills.length)];

    const embed = new MessageEmbed()
      .setColor("#475acf")
      .setDescription(`You ate a pill:\n**${pill}**`);
    interaction.reply({
      embeds: [embed],
      ephemeral: interaction.channel?.id != process.env.SPAM_CHANNEL,
    });
    console.log(`${member.user.tag} ate a ${pill} pill.`);

    db.set(timeKey, interaction.createdTimestamp);
  },
};
