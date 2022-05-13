import { Guild, GuildEmoji, GuildMember, Role } from "discord.js";

export const botColor = "#475acf";

export const Delay = (duration: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, null), duration);
  });
};

export const RemoveURLs = (text: string): string => {
  return text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g, "");
};

const emojis = ["🙂", "😏", "🤨", "😂", "☹️", "🤨", "😒", "😠", "😘", "🙄", "🥺", "🤓", "🤡", "👍"];
export const GetRandomEmoji = (guild: Guild | null): string | GuildEmoji => {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  if (!guild) return randomEmoji;
  return Math.random() < 0.3 ? randomEmoji : guild.emojis.cache.random() || randomEmoji;
};

export const RemoveMarkdown = (text: string): string => {
  const regex = [/`/g, /\*/g, /_/g, /_/g, />/g, /|/g];
  for (const r of regex) text = text.replace(r, "");
  return text;
};

export const RemovePunctuation = (text: string): string => {
  return text.replace(/[^\w\s']|_/g, "");
};

export const GiveRole = (member: GuildMember, roleName: string): void => {
  const role = member.guild.roles.cache.find((r) => r.name === roleName) as Role;
  member.roles.add(role).catch(console.log);
};
