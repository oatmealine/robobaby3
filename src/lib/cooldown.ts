import { GuildMember } from "discord.js";
import { redis } from "./redis";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require("pluralize");

export class CooldownManager {
  private name: string;
  private cooldown: number;

  constructor(name: string, cooldown: number) {
    this.name = name;
    this.cooldown = cooldown;
  }

  GetRemainingTime = async (member: GuildMember): Promise<number> => {
    if (process.env.NODE_ENV === "development") return 0;
    const elapsed = Date.now() - (await this.GetLastUsed(member));
    return this.cooldown - elapsed;
  };

  GetTimeString = (time: number): string => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ${pluralize("day", days)}`;
    if (hours > 0) return `${hours} ${pluralize("hour", hours)}`;
    else if (minutes > 0) return `${minutes} ${pluralize("minute", minutes)}`;
    return `${seconds} ${pluralize("second", seconds)}`;
  };

  Trigger = (member: GuildMember) => redis.set(this.GetKey(member), Date.now());
  Reset = (member: GuildMember) => redis.set(this.GetKey(member), "0");

  private GetKey = (member: GuildMember): string => `cd:${this.name}:${member.id}`;
  private GetLastUsed = async (member: GuildMember): Promise<number> => parseInt((await redis.get(this.GetKey(member))) || "0");

  static ResetCooldown = (name: string, member: GuildMember) => redis.set(`cd:${name}:${member.id}`, "0");
}
