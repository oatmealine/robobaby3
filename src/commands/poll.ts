import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import pluralize from "pluralize";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The question you are asking.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Each option in the poll, separated by commas (max: 5)")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the poll in minutes (max: 60)")
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const options = (interaction.options.getString("options") as string)
      .split(",")
      .slice(0, 5)
      .map((option) => option.trim());

    if (options.length < 2) {
      interaction.reply({
        content: "You must provide at least two options.",
        ephemeral: true,
      });
      return;
    }

    const duration = Math.max(
      1,
      Math.min(interaction.options.getNumber("duration") as number, 60)
    );

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${member.displayName} started a poll`,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle(interaction.options.getString("title") as string)
      .setColor("#475acf")
      .setFooter({
        text: `Poll ends in ${duration} ${pluralize("minute", duration)}`,
      });
    const row = new MessageActionRow();

    let minLeft = duration;
    const ticker = setInterval(() => {
      minLeft--;
      if (minLeft <= 0) clearInterval(ticker);

      embed.setFooter({
        text: `Poll ends in ${minLeft} ${pluralize("minute", minLeft)}`,
      });
      interaction.editReply({ embeds: [embed] });
    }, 60000);

    let buttons: Array<MessageButton> = [];

    const votes: any = {};
    const voters: Array<string> = [];

    for (let i = 0; i < options.length; i++) {
      if (!options[i]) break;

      buttons = [
        ...buttons,
        new MessageButton()
          .setCustomId(`${i}`)
          .setLabel(`${options[i]}`)
          .setStyle("SECONDARY"),
      ];
      votes[`${i}`] = [];
    }
    row.addComponents(buttons);

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = () => true;
    const collector = interaction.channel?.createMessageComponentCollector({
      filter: filter,
      time: duration * 1000 * 60,
    });

    collector?.on("collect", async (i) => {
      if (voters.includes(i.user.id)) {
        i.reply({ content: "You have already voted 😠", ephemeral: true });
        return;
      }

      votes[i.customId].push(i.user.id);
      voters.push(i.user.id);
      i.reply({ content: "Voted!", ephemeral: true });
    });

    collector?.on("end", () => {
      const highest = Object.keys(votes).reduce((a, b) => {
        return votes[a].length > votes[b].length ? a : b;
      });

      const winners = [];
      for (const key in votes) {
        if (votes[key].length === votes[highest].length) {
          winners.push(options[parseInt(key)]);
        }
      }

      options.forEach((option, i) => {
        if (!votes[`${i}`]) return;

        const numVotes = votes[`${i}`].length;
        embed.addField(
          `${option}`,
          `**${numVotes}** ${pluralize("vote", numVotes)}`,
          true
        );
      });
      if (voters.length > 0)
        embed.setDescription(
          `**${pluralize("Winner", winners.length)}:** ${winners.join(" and ")}`
        );
      else embed.setDescription("No one voted 😔");
      embed
        .setAuthor({
          name: `${member.displayName}'s poll results`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setFooter({ text: "" });
      interaction.editReply({ embeds: [embed], components: [] });
      interaction.followUp("Poll has ended. Check it out!");
    });
  },
};