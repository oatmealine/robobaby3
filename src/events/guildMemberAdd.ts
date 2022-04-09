import { GuildMember } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "guildMemberAdd",
  once: false,

  async execute(member: GuildMember) {
    LogEvent(`${member} joined`);
  },
};
