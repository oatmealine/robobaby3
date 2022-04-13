/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { REST } from "@discordjs/rest";
import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
  Client,
  Collection,
} from "discord.js";
import path from "path";
import { loadWatchlist } from "../lib/watchlist";
import { Routes } from "discord-api-types/v9";
import fs = require("node:fs");

import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: "ready",
  once: false,

  execute(client: Client) {
    if (!client || !client.user || !client.application) return;

    client.user.setActivity("The Binding of Isaac: Rebirth", {
      type: "PLAYING",
    });

    client.commands = new Collection();
    const cmdFiles = fs
      .readdirSync(path.join(__dirname, "../commands"))
      .filter((file: string) => file.endsWith(".js"));
    for (const file of cmdFiles) {
      const cmd = require(`../commands/${file}`);
      client.commands.set(cmd.data.name, cmd);
    }

    const rest = new REST({ version: "9" }).setToken(
      process.env.DISCORD_TOKEN as string
    );

    rest
      .get(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID as string,
          process.env.GUILD_ID as string
        )
      )
      .then(async (res: any) => {
        res.forEach((guildCommand: ApplicationCommand) => {
          const perms: ApplicationCommandPermissionData = client.commands.get(
            guildCommand.name
          )?.permissions;
          if (perms)
            client.application?.commands.permissions.set({
              guild: process.env.GUILD_ID as string,
              command: guildCommand.id,
              permissions: [perms],
            });
        });
      });

    loadWatchlist();

    console.log("INITIALIZED");
  },
};
