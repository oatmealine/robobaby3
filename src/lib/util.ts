import { Emoji, Guild, GuildEmoji } from "discord.js";

export function delay(duration: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, null), duration);
  });
}

export function removeUrls(text: string): string {
  return text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, "");
}

const emojis = ["🙂", "😏", "🤨", "😂", "☹️", "🤨", "😒", "😠", "😘", "🙄", "🥺", "🤓", "🤡"];
export function getRandomEmoji(guild: Guild | null): string | GuildEmoji {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  if (!guild) return randomEmoji;
  return Math.random() < 0.3 ? randomEmoji : guild.emojis.cache.random() || randomEmoji;
}
