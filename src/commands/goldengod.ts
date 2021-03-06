import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role } from "discord.js";
import { botColor } from "../lib/util";
import { ReportEvent } from "../lib/log";

module.exports = {
  data: new SlashCommandBuilder().setName("goldengod").setDescription("🌟 Request the Golden God role, given to dedicated members of our old server."),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const role = member.guild.roles.cache.find((r) => r.name === "Golden God") as Role;

    // ensure doesn't have role
    if (member.roles.cache.has(role.id)) {
      interaction.reply({
        content: `You already have the ${role} role.`,
        ephemeral: true,
      });
      return;
    }

    // reply to member
    const embed = new MessageEmbed()
      .setColor(botColor)
      .setDescription(
        "**Your request has been sent for review.**\nIf you were an `Angel`, `Demon`, or `Golden God` on the old server, you will be granted the role."
      );
    interaction.reply({ embeds: [embed], ephemeral: true });

    // send request to mods
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("approve").setLabel("Approve").setStyle("SUCCESS"),
      new MessageButton().setCustomId("deny").setLabel("Deny").setStyle("DANGER")
    );

    const modReport = await ReportEvent(member.guild, {
      content: `${member} requested the Golden God role`,
      components: [row],
    }).catch(console.log);

    // mod response
    const collector = modReport?.channel?.createMessageComponentCollector({
      time: 1000 * 60 * 60 * 24,
      filter: (i) => i.member.roles.cache.has(process.env.ROLE_MOD as string),
    });

    collector?.on("collect", async (i) => {
      const button = new MessageButton().setCustomId("nope").setDisabled(true);

      if (i.customId === "approve") {
        if (role) {
          member.roles.add(role);
          button.setLabel(`${i.user.username} approved the request`);
          button.setStyle("SUCCESS");
          i.reply({ content: "Approved!", ephemeral: true }).catch(console.log);
          interaction.user.send("You have been granted the **Golden God** role!").catch(console.log);
        }
      } else {
        button.setLabel(`${i.user.username} denied the request`);
        button.setStyle("DANGER");
        i.reply({ content: "Denied!", ephemeral: true }).catch(console.log);
        interaction.user.send("Unfortunately, your request for **Golden God** has been denied.").catch(console.log);
      }

      modReport?.edit({ components: [new MessageActionRow().addComponents(button)] });
      collector.stop();
    });
  },
};
