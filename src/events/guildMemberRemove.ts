import { GuildMember } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "guildMemberRemove",
  once: false,

  async execute(member: GuildMember) {
    LogEvent(`${member} left`);
    console.log(`${member.user.tag} left`);
  },
};
