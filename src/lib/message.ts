import { Message, Permissions, TextChannel, User } from "discord.js";
import { delay, getRandomEmoji } from "./util";

import * as dotenv from "dotenv";
dotenv.config();

export async function sendMessage(
  location: TextChannel | Message | User,
  content: string,
  maxThinkDuration = 0
): Promise<Message | null> {
  await delay((Math.random() * maxThinkDuration) / 2 + maxThinkDuration / 2);

  if (location instanceof TextChannel) location.sendTyping();
  else if (location instanceof Message) location.channel.sendTyping();

  await delay(Math.random() * 500 + content.length * 15);

  if (location instanceof Message) {
    location
      .reply(content)
      .then((msg: Message) => {
        return msg;
      })
      .catch(console.log);
  } else {
    location
      .send(content)
      .then((msg: Message) => {
        return msg;
      })
      .catch(console.log);
  }
  return null;
}

export const removeInvites = (message: Message): void => {
  if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
    return;

  if (
    message.content.match(
      /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g
    )
  ) {
    message.delete();
    sendMessage(
      message.author,
      `Don't send invite links to other servers. If you must, send them to the interested parties directly. ${getRandomEmoji(
        message.guild
      )}`
    );
  }
};
