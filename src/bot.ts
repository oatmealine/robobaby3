import { Client, Intents } from "discord.js";
import path from "path";
const fs = require("node:fs");
require("dotenv").config();

export const client: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

const eventFiles = fs.readdirSync(path.join(__dirname, "./events")).filter((file: string) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
