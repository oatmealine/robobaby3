/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonInteraction, Client, MessageButton, MessageButtonStyleResolvable, TextChannel } from "discord.js";
interface ElementData {
  [key: string]: unknown;
}

export abstract class InteractiveElementManager {
  private static channels: string[] = [];
  protected static data: ElementData = {};
  protected static elementName = "";

  static Initialize(client: Client, data: ElementData, validChannels: string[]) {
    this.data = data;
    this.channels = validChannels;
    this.CreateButtonCollectors(client, validChannels);
  }

  private static async CreateButtonCollectors(client: Client, channels: string[]) {
    for (const channelId of channels) {
      const channel = (await client.channels.fetch(channelId)) as TextChannel;
      if (!channel) continue;

      const collector = channel.createMessageComponentCollector({ filter: (i) => i.customId.startsWith(this.elementName) });
      collector.on("collect", (i) => {
        this.Use(i as ButtonInteraction, i.customId.split("-")[1], i.customId.split("-")[2]);
      });
    }
  }

  static CreateButton(id: string, action: string, label: string, style: MessageButtonStyleResolvable) {
    return new MessageButton().setCustomId(`${this.elementName}-${action}-${id}`).setLabel(label).setStyle(style);
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    console.log("Used");
  }
  public static Create(channel: TextChannel, id: string) {
    console.log("Created");
  }
}
