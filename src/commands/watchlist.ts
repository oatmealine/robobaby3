import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../lib/watchlist";

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
        .addStringOption((option) => option.setName("reason").setDescription("Reason for watching this user."))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("[MODERATOR] Remove a member from the watchlist.")
        .addUserOption((option) => option.setName("user").setDescription("The member to remove.").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("Reason for watching this user."))
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("[MODERATOR] List all users in the watchlist.")),

  permissions: { type: "ROLE", id: process.env.ROLE_MOD, permission: true },

  async execute(interaction: CommandInteraction) {
    if (!interaction.guild) return;

    const subcommand = interaction.options.getSubcommand(true);

    // list
    if (subcommand == "list") {
      if (!interaction.guild) return;
      const list = await getWatchlist(interaction.guild);
      const embed = new MessageEmbed().setTitle("Watchlist").setDescription(list.length ? list.join("\n") : "No users in the watchlist.");
      interaction.reply({ embeds: [embed] });
      return;
    }

    // validate
    const user = interaction.options.getUser("user");
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
        content: `You don't have permission to watch ${target}.`,
        ephemeral: true,
      });
      return;
    }

    // add/remove
    const embed = new MessageEmbed();
    let success = false;
    switch (subcommand) {
      case "add":
        success = await addToWatchlist(interaction.guild, target.id);
        if (success)
          embed.setAuthor({
            name: `${target.displayName} added to watchlist`,
            iconURL: target.user.displayAvatarURL(),
          });
        else
          embed.setAuthor({
            name: `${target.displayName} already in watchlist`,
            iconURL: target.user.displayAvatarURL(),
          });
        break;
      case "remove":
        removeFromWatchlist(interaction.guild, target.id);
        embed.setAuthor({
          name: `${target.displayName} removed from watchlist`,
          iconURL: target.user.displayAvatarURL(),
        });
        break;
    }

    const reason = interaction.options.getString("reason");
    if (reason) embed.setDescription(`**Reason:** ${reason}`);

    interaction.reply({ embeds: [embed] });
  },
};
