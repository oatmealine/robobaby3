import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, MessageEmbed } from "discord.js";
import { botColor } from "../lib/util";
import { LogEvent, ReportEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("🚨 Quietly summon a moderator to deal with a problem.")
    .addStringOption((option) => option.setName("reason").setDescription("[OPTIONAL] Reason for the report.").setRequired(false)),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    // reply
    const embed = new MessageEmbed()
      .setColor(botColor)
      .setTitle("**The moderators have been alerted.**")
      .setDescription("Thanks for your report. You may receive a message if the report is resolved.");
    interaction.reply({ embeds: [embed], ephemeral: true });

    // send to moderators
    const reason = interaction.options.getString("reason");
    ReportEvent(member.guild, {
      content: `${member} used \`/report\` in ${interaction.channel}\n\`\`\`${
        reason || "No reason provided."
      }\`\`\`Reply to this message to reply to the user.`,
    })
      .then((msg) => {
        // collect responses
        if (!msg) return;
        const filter = (message: Message) => {
          return message.mentions.users.has(message.client.user?.id || "") && message.reference?.messageId == msg.id;
        };
        msg?.channel
          .awaitMessages({
            filter: filter,
            max: 1,
            time: 1000 * 60 * 60 * 24,
          })
          .then((collected) => {
            const replyMsg = collected.first();
            if (replyMsg) handleResponse(replyMsg, member);
          })
          .catch(console.log);
      })
      .catch(console.log);

    LogEvent(`${member} used \`/report\` in ${interaction.channel}.`);
    console.log(`${member.user.tag} used /report in ${interaction.channel}.`);
  },
};

const handleResponse = (message: Message, member: GuildMember) => {
  const embed = new MessageEmbed()
    .setDescription(`The appropriate action has been taken by the moderation team.\n>>> **Message:** ${message.content}`)
    .setAuthor({
      name: `${message.member?.displayName} responded to your report`,
      iconURL: message.author.displayAvatarURL(),
    })
    .setFooter({ text: "Do not respond to this message. I am just the delivery boy 😳" })
    .setColor(botColor);
  member
    ?.send({ embeds: [embed] })
    .then(() => {
      message.reply({ content: `Message sent to ${member}:`, embeds: [embed] });
    })
    .catch((err) => {
      message.reply(`Couldn't DM ${member}. They may have DMs disabled.`);
      console.log(err);
    });
};
