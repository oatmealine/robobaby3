import { Client, Collection } from "discord.js";
import path from "path";
const fs = require("node:fs");

module.exports = {
  name: "ready",
  once: false,

  execute(client: Client) {
    if (!client || !client.user || !client.application) return;

    client.user.setActivity("The Binding of Isaac: Rebirth", { type: "PLAYING" });

    client.commands = new Collection();
    const cmdFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file: string) => file.endsWith(".js"));
    for (const file of cmdFiles) {
      const cmd = require(`../commands/${file}`);
      client.commands.set(cmd.data.name, cmd);
    }

    console.log("INITIALIZED");
  },
};
