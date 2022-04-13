import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../lib/watchlist";

const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watchlist")
    .setDescription("[MODERATOR] Manage the member watchlist.")
    .setDefaultPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("[MODERATOR] Add a member to the watchlist.")
        .addUserOption((option) => option.setName("user").setDescription("The member to add.").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("[MODERATOR] Remove a member from the watchlist.")
        .addUserOption((option) => option.setName("user").setDescription("The member to remove.").setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("[MODERATOR] List all users in the watchlist.")),

  permissions: { type: "ROLE", id: process.env.MOD_ROLE, permission: true },

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const subcommand = interaction.options.getSubcommand(true);

    // list
    if (subcommand == "list") {
      if (!interaction.guild) return;
      const list = await getWatchlist(interaction.guild);
      const embed = new MessageEmbed().setTitle("Watchlist").setDescription(list.length ? list.join("\n") : "No users in the watchlist.");
      interaction.reply({ embeds: [embed] });
      return;
    }

    const user = interaction.options.getUser("user");
    if (!user) {
      interaction.reply({ content: `There was an error finding the user. Please try again.`, ephemeral: true });
      return;
    }
    const target = interaction.guild?.members.cache.get(user.id);
    if (!target) {
      interaction.reply({ content: `You don't have permission to watch ${target}.`, ephemeral: true });
      return;
    }

    const embed = new MessageEmbed();
    let success = false;
    switch (subcommand) {
      case "add":
        success = await addToWatchlist(target.id);
        if (success) embed.setAuthor({ name: `${target.displayName} added to watchlist`, iconURL: target.user.displayAvatarURL() });
        else embed.setAuthor({ name: `${target.displayName} already in watchlist`, iconURL: target.user.displayAvatarURL() });
        break;
      case "remove":
        success = await removeFromWatchlist(target.id);
        if (success) embed.setAuthor({ name: `${target.displayName} removed from watchlist`, iconURL: target.user.displayAvatarURL() });
        else embed.setAuthor({ name: `${target.displayName} is not in watchlist`, iconURL: target.user.displayAvatarURL() });
        break;
    }
    interaction.reply({ embeds: [embed] });
  },
};
