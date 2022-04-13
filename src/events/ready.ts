import { REST } from "@discordjs/rest";
import { ApplicationCommand, ApplicationCommandPermissionData, Client, Collection } from "discord.js";
import path from "path";
import { loadWatchlist } from "../lib/watchlist";
const { Routes } = require("discord-api-types/v9");
const fs = require("node:fs");
require("dotenv").config();

interface PermBlock {
  id: string;
  permissions: ApplicationCommandPermissionData;
}

module.exports = {
  name: "ready",
  once: false,

  execute(client: Client) {
    if (!client || !client.user || !client.application) return;

    client.user.setActivity("The Binding of Isaac: Rebirth", { type: "PLAYING" });

    client.commands = new Collection();
    const localPerms = {};
    const cmdFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file: string) => file.endsWith(".js"));
    for (const file of cmdFiles) {
      const cmd = require(`../commands/${file}`);
      client.commands.set(cmd.data.name, cmd);
    }

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN as string);

    rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)).then(async (res: any) => {
      res.forEach((guildCommand: ApplicationCommand) => {
        const perms: ApplicationCommandPermissionData = client.commands.get(guildCommand.name)?.permissions;
        if (perms) client.application?.commands.permissions.set({ guild: process.env.GUILD_ID as string, command: guildCommand.id, permissions: [perms] });
      });
    });

    loadWatchlist();

    console.log("INITIALIZED");
  },
};
