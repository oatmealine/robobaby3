/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection } from "discord.js";
import { connectToRedis } from "../lib/redis";
import { initializeChestGenerator } from "../lib/chest";
import { initializeShop } from "../lib/shop";
import { createStatButtonCollector } from "../lib/memberStats";
import path from "path";
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

    loadCommands(client);
    connectToRedis();

    createStatButtonCollector(client);
    initializeChestGenerator(client);
    initializeShop(client);
  },
};

const loadCommands = (client: Client) => {
  client.commands = new Collection();
  const cmdFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file: string) => file.endsWith(".js"));
  for (const file of cmdFiles) {
    const cmd = require(`../commands/${file}`);
    client.commands.set(cmd.data.name, cmd);
  }
};
