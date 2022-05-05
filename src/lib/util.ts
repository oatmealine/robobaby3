import { Guild, GuildEmoji } from "discord.js";

export const botColor = "#475acf";

export const delay = (duration: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, null), duration);
  });
};

export const removeUrls = (text: string): string => {
  return text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g, "");
};

const emojis = ["🙂", "😏", "🤨", "😂", "☹️", "🤨", "😒", "😠", "😘", "🙄", "🥺", "🤓", "🤡", "👍"];
export const getRandomEmoji = (guild: Guild | null): string | GuildEmoji => {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  if (!guild) return randomEmoji;
  return Math.random() < 0.3 ? randomEmoji : guild.emojis.cache.random() || randomEmoji;
};

export const removeMarkdown = (text: string): string => {
  const regex = [/`/g, /\*/g, /_/g, /_/g, />/g, /|/g];
  for (const r of regex) text = text.replace(r, "");
  return text;
};

export const removePunctuation = (text: string): string => {
  return text.replace(/[^\w\s']|_/g, "");
};
