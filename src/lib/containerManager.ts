import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { containerData, containerSpawnPool, IContainerData } from "./data/containers";
import { statData } from "./data/stats";
import { IElementData, InteractiveElementManager } from "./interactiveElement";
import { Statistics } from "./statistics";
import { StatManager } from "./statManager";
import { botColor } from "./util";

const generateChance = 0.04;

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
      const emoji = hasCost
        ? Object.keys(data.cost)
            .map((stat) => statData[stat].icon)
            .join("")
        : "";

      row.addComponents(ContainerManager.CreateButton(id, action, data.label, hasCost ? "PRIMARY" : "SUCCESS", emoji));
    }
    channel.send({ files: [`./images/containers/${id}/closed.png`], components: [row] });
    console.log(`Container (${id}) spawned`);
    Statistics.Increment({ category: ["containers", "spawned", id] });
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const container = ContainerManager.data[id] as IContainerData;
    if (!container || !container.actions) return;
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
    }

    // validate
    if (actionData.cost) {
      for await (const [stat, cost] of Object.entries(actionData.cost)) {
        if ((await StatManager.GetStat(member, stat)) < cost) {
          i.reply({ content: "You can't afford that.", ephemeral: true });
          console.log(`${member.user.tag} can't afford container ${id} (${action})`);
          return;
        }
        StatManager.AdjustStat(member, stat, -cost);
      }
    }

    // open container
    if (!container.infinite) {
      const msg = i.message as Message;
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("nope").setLabel(`Claimed by ${member.displayName}`).setStyle("DANGER").setDisabled(true)
      );
      const statsRow = new MessageActionRow().addComponents(StatManager.CreateButton(member.id, "view", "View Stats", "SECONDARY", "🔭"));
      msg.edit({ files: [`./images/containers/${id}/open.png`], components: [row, statsRow] }).catch(console.log);
    }
    container.cooldown?.Trigger(member);

    // get loot
    const loot = actionData.effect(i);
    if (loot) {
      const embed = new MessageEmbed().setTitle("You obtained").setColor(botColor);
      let containsLoot = false;
      for (const [key, value] of Object.entries(loot)) {
        if (value === 0) continue;
        containsLoot = true;
        const stat = statData[key];
        embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
        await StatManager.AdjustStat(member, key, value);
      }
      if (!containsLoot) embed.addField("Nothing", "☹️");

      const statsEmbed = await StatManager.GetEmbed(member, ["coins", "bombs", "keys"]);
      await i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
      console.log(`Container (${id}) [${action}] opened by ${member.displayName}`);
      Statistics.Increment({ category: [this.elementName, action, id] });

      // lucky coin
      StatManager.GetStat(member, "luck").then(async (luck) => {
        const luckStat = statData["luck"];
        if (Math.random() < (luck * 0.25) / luckStat.maxValue) {
          await StatManager.AdjustStat(member, "coins", 1);

          const coinEmbed = await StatManager.GetEmbed(member, ["coins"]);
          i.followUp({ content: `You found an **extra coin**. Lucky! ${luckStat.icon}`, embeds: [coinEmbed], ephemeral: true });
        }
      });
    } else {
      const statsEmbed = await StatManager.GetEmbed(member, ["coins", "bombs", "keys"]);
      i.reply({ content: "There was nothing inside ☹️", embeds: [statsEmbed], ephemeral: true });
    }
  }

  static StartGenerator(client: Client) {
    const channel = this.GetChestChannel(client);
    setInterval(() => {
      if (Math.random() < generateChance) {
        this.CreateFromPool(channel, containerSpawnPool);

        const role = channel.guild?.roles.cache.find((r) => r.name === "Inner Eye");
        channel.send(`${role}`).then((msg) => msg.delete());
      }
    }, 1000 * 60);
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
