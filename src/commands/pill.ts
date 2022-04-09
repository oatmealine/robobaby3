import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

const pills = ["🔋 48 Hour Energy", "❓ Amnesia", "💨 Bad Gas", "😈 Bad Trip", "💙 Balls of Steel", "💣 Bombs Are Key 🔑", "💥 Explosive Diarrhea", "💖 Full Health", "🔽 Health Down", "🔼 Health Up", "💕 Hematemesis", "👀 I Can See Forever", "😏 I Found Pills", "🍋 Lemon Party", "🔽 Luck Down", "😐 Paralysis", "👃 Pheromones", "👦🏼 Puberty", "🛡️ Pretty Fly", "🔽 Range Down", "🔼 Range Up", "✨ R U a Wizard?", "🔽 Speed Down", "🔼 Speed Up", "🔽 Tears Down", "🔼 Tears Up", "🌟 Telepills", "🍺 Addicted", "🙏 Friends Till The End!", "🕷️ Infested!", "🕸️ Infested?", "◾ One Makes You Small", "◼️️ One Makes You Larger", "💊 Percs", "🕹️ Power Pill", "💩 Re-Lax", "👾 Retro Vision", "🌽 ???", "🌞 Feels like I'm walking on sunshine!", "🍸 Gulp!", "💣 Horf!", "😴 I'm Drowsy...", "😀 I'm Excited!!!", "🤢 Something's wrong...", "😩 Vurp!", "💩 X-Lax", "😷 Experimental Pill", "🔽 Shot Speed Down", "🔼 Shot Speed Up"];

module.exports = {
  data: new SlashCommandBuilder().setName("pill").setDescription("Eat a pill."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = new MessageEmbed().setColor("#475acf").setDescription(`You ate a pill:\n**${pills[Math.floor(Math.random() * pills.length)]}**`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
