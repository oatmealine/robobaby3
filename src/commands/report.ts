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
    // reply
    const embed = new MessageEmbed()
      .setColor("#475acf")
      .setTitle("**The moderators have been alerted.**")
      .setDescription(
        "Thanks for your report. You may receive a message if the report is resolved."
      );
    interaction.reply({ embeds: [embed], ephemeral: true });

    // send to moderators
    ReportEvent(member.guild, {
      content: `${member} used \`/report\` in ${interaction.channel}\nReply to this message to reply to the user.`,
    })
      .then((msg) => {
        msg?.channel
          .awaitMessages({
            filter: collectionFilter,
            max: 1,
            time: 1000 * 60 * 60 * 12,
          })
          .then((collected) => {
            // handle moderator response
            const replyMsg = collected.first();
            if (replyMsg) {
              const embed = new MessageEmbed()
                .setTitle("Your report has been resolved!")
                .setDescription(
                  `The appropriate action has been taken by the moderation team.\n\n>>> **Message:** ${replyMsg.content}`
                )
                .setAuthor({
                  name: replyMsg.member?.displayName as string,
                  iconURL: replyMsg.author.displayAvatarURL(),
                })
                .setColor("#475acf");
              member?.send({ embeds: [embed] });
              replyMsg.reply(`Message sent to ${member}`);
            }
          })
          .catch(console.log);
      })
      .catch(console.log);
    console.log(`${member.user.tag} used /report in ${interaction.channel}.`);
  },
};
