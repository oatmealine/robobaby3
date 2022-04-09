import { Message } from "discord.js";
import { LogEvent } from "../lib/log";
const fs = require("node:fs");

module.exports = {
  name: "messageDelete",
  once: false,

  async execute(message: Message) {
    LogEvent(`Message from ${message.author} deleted in ${message.channel}:\n${message.content}`);
  },
};
