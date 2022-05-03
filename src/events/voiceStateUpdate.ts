import { TextChannel, VoiceState } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: "voiceStateUpdate",
  once: false,

  async execute(oldState: VoiceState, newState: VoiceState) {
    const channelMembers = oldState.channel?.members.size || newState.channel?.members.size || 0;
    const textChannel = newState.client.channels.cache.get(process.env.CHANNEL_VOICECHAT as string) as TextChannel;

    const everyone = newState.guild.roles.cache.find((role) => role.name === "@everyone");
    if (!everyone) return;

    textChannel.permissionOverwrites.edit(everyone, { VIEW_CHANNEL: channelMembers > 0 });
  },
};
