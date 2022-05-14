import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { containerData, IContainerData } from "./data/containers";
import { statData } from "./data/stats";
import { IElementData, InteractiveElementManager } from "./interactiveElement";
import { StatManager } from "./statManager";
import { botColor } from "./util";

export class ContainerManager extends InteractiveElementManager {
  protected static elementName = "container";

  static Initialize(client: Client, data: IElementData, validChannels: string[]) {
    super.Initialize(client, data, validChannels);
    this.StartGenerator(client);
  }

  static Create(channel: TextChannel, id: string) {
    const container = ContainerManager.data[id] as IContainerData;

    const row = new MessageActionRow();
    for (const [action, data] of Object.entries(container.actions)) {
      const hasCost = Object.keys(data.cost).length > 0;
      const costString = hasCost
        ? Object.keys(data.cost)
            .map((stat) => statData[stat].icon)
            .join("")
        : "";

      row.addComponents(ContainerManager.CreateButton(id, action, hasCost ? `${data.label} (${costString})` : data.label, hasCost ? "PRIMARY" : "SUCCESS"));
    }
    channel.send({ files: [`./images/containers/${id}/closed.png`], components: [row] });
    console.log(`Container (${id}) spawned`);
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const container = ContainerManager.data[id] as IContainerData;
    const actionData = container.actions[action];

    const member = await i.guild?.members.fetch(i.member?.user.id as string);
    if (!member) return;

    // cooldown
    if (container.cooldown) {
      const remaining = (await container.cooldown?.GetRemainingTime(member)) || 0;

      if (remaining > 0) {
        i.reply({
          content: `You can do this again in **${container.cooldown?.GetTimeString(remaining)}**.`,
          ephemeral: true,
        });
        return;
      }
      container.cooldown?.Trigger(member);
    }

    // validate
    for await (const [stat, cost] of Object.entries(actionData.cost)) {
      if ((await StatManager.GetStat(member, stat)) < cost) {
        i.reply({ content: "You can't afford that.", ephemeral: true });
        console.log(`${member.user.tag} can't afford container ${id}`);
        return;
      }
      StatManager.AdjustStat(member, stat, -cost);
    }

    // open container
    if (!container.infinite) {
      const msg = i.message as Message;
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("nope").setLabel(`Claimed by ${member.displayName}`).setStyle("DANGER").setDisabled(true)
      );
      const statsRow = new MessageActionRow().addComponents(StatManager.CreateButton(member.id, "view", `View ${member.displayName}'s stats`, "SECONDARY"));
      msg.edit({ files: [`./images/containers/${id}/open.png`], components: [row, statsRow] }).catch(console.log);
    }

    // get loot
    const loot = actionData.effect(i);
    if (loot) {
      const embed = new MessageEmbed().setTitle("You obtained").setColor(botColor);
      for (const [key, value] of Object.entries(loot)) {
        if (value === 0) continue;
        const stat = statData[key];
        embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
        await StatManager.AdjustStat(member, key, value);
      }
      const statsEmbed = await StatManager.GetEmbed(member, ["coins", "bombs", "keys"]);
      i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
      console.log(`Container (${id}) opened by ${member.displayName}`);
    }
  }

  static StartGenerator(client: Client) {
    const channel = this.GetChestChannel(client);
    setInterval(() => {
      if (Math.random() < 0.0075) {
        this.CreateBatch(client, Math.ceil(Math.random() * 5));

        const role = channel.guild?.roles.cache.find((r) => r.name === "Inner Eye");
        channel.send(`${role}`).then((msg) => msg.delete());
      }
    }, 1000 * 60);
  }

  static CreateBatch(client: Client, amount: number) {
    for (let i = 0; i < amount; i++) {
      if (Math.random() > 0.05) ContainerManager.Create(this.GetChestChannel(client), "common");
      else ContainerManager.Create(this.GetChestChannel(client), Math.random() < 0.5 ? "gold" : "stone");
    }
  }

  static GetChestChannel = (client: Client) => client.channels.cache.get(process.env.CHANNEL_CHESTS as string) as TextChannel;
}

export const InitializeContainers = (client: Client) => {
  ContainerManager.Initialize(client, containerData, [
    process.env.CHANNEL_CHAT as string,
    process.env.CHANNEL_CHESTS as string,
    process.env.CHANNEL_SECRET as string,
    process.env.CHANNEL_ERROR as string,
    process.env.CHANNEL_ARCADE as string,
  ]);
};
