import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { StatManager } from "../lib/stats";
import { MemberStats } from "../lib/data/stats";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstat")
    .setDescription("[ADMIN] Set a member's stat.")
    .setDefaultPermission(false)
    .addUserOption((option) => option.setName("member").setDescription("Member to set the stats of").setRequired(true))
    .addStringOption((option) => {
      option.setName("stat").setDescription("The stat.").setRequired(true);
      for (const choice of Object.keys(MemberStats)) option.addChoice(choice, choice);
      return option;
    })
    .addNumberOption((option) => option.setName("value").setDescription("The value.").setRequired(true)),

  async execute(interaction: CommandInteraction, member: GuildMember) {
    const stat = interaction.options.getString("stat") as string;
    const user = interaction.options.getUser("member");
    const target = interaction.guild?.members.cache.get(user?.id || "") || member;

    StatManager.SetStat(target, stat, interaction.options.getNumber("value") as number);
    interaction.reply({ content: "Set.", ephemeral: true });
  },
};
