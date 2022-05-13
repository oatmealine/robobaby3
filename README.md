# Robo-Baby 3.0

Discord.js bot made specifically for the [Modding of Isaac Discord server](https://discord.gg/3eACyXaffZ). He is meant to be the latest tech and also the village idiot.

## Setup

- A server template for development can be found [here](https://discord.new/jfezNGPgwDA4).
- You'll need a local Redis server or a free [Redis To Go](https://redistogo.com/) account for the database.
- For the shop, you'll need an [Imgur application client ID](https://apidocs.imgur.com/).
- For robochat, you'll need:
  - Cleverbot API key (not free)
  - Google Cloud Platform service account JSON key with access to Vision API placed in `/keys/google-credentials.json`

## Usage

- `npm run dev` - Start the bot
- `npm run deploy-commands` - Push commands to the guild
- `npm run delete-commands` - Clear all guild commands
