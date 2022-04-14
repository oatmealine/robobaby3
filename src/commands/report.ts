import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  Message,
  MessageEmbed,
} from "discord.js";
import { ReportEvent } from "../lib/log";

const collectionFilter = (message: Message): boolean => {
  return message.mentions.users.has(message.client.user?.id || "");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Quietly summon a moderator to deal with a problem."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const embed = new MessageEmbed()
      .setColor("#475acf")
      .setTitle("**The moderators have been alerted.**")
      .setDescription("Thanks for your report.");
    interaction.reply({ embeds: [embed], ephemeral: true });

    ReportEvent(
      member.guild,
      `${member} used \`/report\` in ${interaction.channel}\nReply to this message to reply to the user.`
    )
      .then((msg) => {
        msg?.channel
          .awaitMessages({
            filter: collectionFilter,
            max: 1,
            time: 1000 * 60 * 60 * 12,
          })
          .then((collected) => {
            const replyMsg = collected.first();
            if (replyMsg) {
              member?.send(
                `Thanks for your report. The appropriate action has been taken by ${replyMsg.author}. They provided this message:\n>>> ${replyMsg.content}`
              );
            }
          })
          .catch(console.log);
      })
      .catch(console.log);
    console.log(`${member.user.tag} used /report in ${interaction.channel}.`);
  },
};
