import { GuildMember } from "discord.js";
import { LogEvent } from "../lib/log";

module.exports = {
  name: "guildMemberUpdate",
  once: false,

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    if (oldMember.nickname !== newMember.nickname) {
      if (!newMember.nickname) {
        LogEvent(`${newMember.user.tag} removed their nickname`);
        console.log(`${oldMember.user.tag} removed their nickname`);
        return;
      }

      LogEvent(`${oldMember} changed their nickname to ${newMember.nickname}`);
      console.log(`${oldMember.user.tag} changed their nickname to ${newMember.nickname}`);
    }
  },
};
