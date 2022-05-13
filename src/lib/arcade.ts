import { ButtonInteraction, MessageActionRow, TextChannel } from "discord.js";
import { InteractiveElementManager } from "./interactiveElement";

export class ArcadeManager extends InteractiveElementManager {
  protected static elementName = "arcade";

  static Create(channel: TextChannel, id: string) {
    const row = new MessageActionRow().addComponents(ArcadeManager.CreateButton(id, "play", "Use Machine", "SUCCESS"));
    channel.send({ files: [`./images/arcades/${id}.png`], components: [row] });
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {}
}
