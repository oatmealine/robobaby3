import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { LogEvent } from "../lib/log";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("🗳️ Create a poll.")
    .addStringOption((option) => option.setName("title").setDescription("The question you are asking.").setRequired(true))
    .addStringOption((option) => option.setName("options").setDescription("Each option in the poll, separated by commas (max: 5)").setRequired(true))
    .addNumberOption((option) => option.setName("duration").setDescription("Duration of the poll in minutes (max: 60)").setRequired(true)),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const votes: { [key: string]: Array<string> } = {};
    const voters: Array<string> = [];
    const title = interaction.options.getString("title") as string;

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

    const duration = Math.max(1, Math.min(interaction.options.getNumber("duration") as number, 60));

    const row = new MessageActionRow();
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${member.displayName} started a poll`,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle(title)
      .setColor("#475acf")
      .setFooter({
        text: `Poll ends in ${duration} ${pluralize("minute", duration)} from creation`,
      });

    let buttons: Array<MessageButton> = [];

    for (let i = 0; i < options.length; i++) {
      if (!options[i]) break;

      buttons = [...buttons, new MessageButton().setCustomId(`${i}`).setLabel(`${options[i]}`).setStyle("SECONDARY")];
      votes[`${i}`] = [];
    }
    row.addComponents(buttons);

    await interaction.reply({ embeds: [embed], components: [row] });
    LogEvent(`Poll started by ${member}: ${title}`);
    console.log(`Poll started by ${member.displayName}: ${title}`);

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
        embed.addField(`${option}`, `**${numVotes}** ${pluralize("vote", numVotes)}`, true);
      });
      if (voters.length > 0) embed.setDescription(`**${pluralize("Winner", winners.length)}:** ${winners.join(" and ")}`);
      else embed.setDescription("No one voted 😔");
      embed
        .setAuthor({
          name: `${member.displayName}'s poll results`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setFooter({ text: "" });
      interaction.editReply({ embeds: [embed], components: [] });
      interaction.followUp("Poll has ended. Check it out!");

      LogEvent(`Poll ended by ${member}: ${title}`);
      console.log(`Poll ended by ${member.displayName}: ${title}`);
    });
  },
};
