/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection } from "discord.js";
import { ConnectToRedis } from "../lib/redis";
import { InitializeContainers } from "../lib/containerManager";
import { InitializeStats } from "../lib/statManager";
import { InitializeItems } from "../lib/itemManager";
import { Watchlist } from "../lib/watchlist";
import path from "path";
import fs = require("node:fs");

module.exports = {
  name: "ready",
  once: false,

  async execute(client: Client) {
    if (!client || !client.user || !client.application) return;

    client.user.setActivity("The Binding of Isaac: Rebirth", {
      type: "PLAYING",
    });

    LoadCommands(client);

    await ConnectToRedis();
    InitializeStats(client);
    InitializeItems(client);
    InitializeContainers(client);
    Watchlist.Load();
  },
};

const LoadCommands = (client: Client) => {
  client.commands = new Collection();
  const cmdFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file: string) => file.endsWith(".js"));
  for (const file of cmdFiles) {
    const cmd = require(`../commands/${file}`);
    client.commands.set(cmd.data.name, cmd);
  }
};
