import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { ItemManager } from "../lib/itemManager";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("items")
    .setDescription("🎒 View your or another member's items.")
    .addUserOption((option) => option.setName("member").setDescription("Member to view the items of (leave blank for self)")),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const user = interaction.options.getUser("member");
    const target = interaction.guild?.members.cache.get(user?.id || "") || member;

    const items = await ItemManager.GetItems(target);

    if (items.length === 0) {
      interaction.reply({ content: `${target} has no items.`, ephemeral: true });
      return;
    }

    const images = items.map((i) => `./images/items/${i}.png`);

    const embed = new MessageEmbed()
      .setAuthor({ name: `${target.displayName}'s items`, iconURL: target.user.displayAvatarURL() })
      .setColor(target.displayColor);
    interaction.reply({ embeds: [embed], files: images, ephemeral: true });
    console.log(`${member.user.tag} viewed ${target.user.tag}'s items`);
  },
};
