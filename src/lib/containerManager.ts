import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { containerData, ContainerData } from "./data/containers";
import { MemberStats } from "./data/stats";
import { InteractiveElementManager } from "./interactiveElement";
import { StatManager } from "./stats";
import { botColor } from "./util";

export class ContainerManager extends InteractiveElementManager {
  protected static elementName = "container";

  static Create(channel: TextChannel, id: string) {
    const container = ContainerManager.data[id] as ContainerData;

    const hasCost = Object.keys(container.cost).length > 0;
    const costString = hasCost
      ? Object.keys(container.cost)
          .map((stat) => MemberStats[stat].icon)
          .join("")
      : "";

    const row = new MessageActionRow().addComponents(
      ContainerManager.CreateButton(id, "open", hasCost ? `${container.buttonText} (${costString})` : container.buttonText, hasCost ? "PRIMARY" : "SUCCESS")
    );
    channel.send({ files: [`./images/containers/${id}/closed.png`], components: [row] });
    console.log(`Container (${id}) spawned`);
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const container = ContainerManager.data[id] as ContainerData;

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
    for await (const [stat, cost] of Object.entries(container.cost)) {
      if ((await StatManager.GetStat(member, stat)) < cost) {
        i.reply({ content: "You can't afford that.", ephemeral: true });
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
    const loot = container.possibleContents();
    const embed = new MessageEmbed().setTitle("You obtained").setColor(botColor);
    for (const [key, value] of Object.entries(loot)) {
      if (value === 0) continue;
      const stat = MemberStats[key];
      embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
      await StatManager.AdjustStat(member, key, value);
    }
    const statsEmbed = await StatManager.GetEmbed(member, ["coins", "bombs", "keys"]);
    i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
    console.log(`Container (${id}) opened by ${member.displayName}`);
  }
}

export const InitializeContainers = (client: Client) => {
  ContainerManager.Initialize(client, containerData, [
    process.env.CHANNEL_CHAT as string,
    process.env.CHANNEL_CHESTS as string,
    process.env.CHANNEL_SECRET as string,
    process.env.CHANNEL_ERROR as string,
    process.env.CHANNEL_ARCADE as string,
  ]);

  const channel = client.channels.cache.get(process.env.CHANNEL_containerS as string) as TextChannel;
  setInterval(() => {
    if (Math.random() < 0.0075) {
      if (Math.random() > 0.15) ContainerManager.Create(channel, "common");
      else ContainerManager.Create(channel, Math.random() < 0.5 ? "gold" : "stone");
    }
  }, 1000 * 60);
};
