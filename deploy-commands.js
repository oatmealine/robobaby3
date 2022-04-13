const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

const commands = [];
const commandFiles = fs
  .readdirSync("./dist/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./dist/commands/${file}`);
  commands.push(command.data.toJSON());
}

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  )
  .then(() => console.log("All commands added."))
  .catch(console.error);
