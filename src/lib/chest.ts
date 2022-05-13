import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { ChestData, chests } from "./data/chests";
import { MemberStats } from "./data/stats";
import { InteractiveElementManager } from "./interactiveElement";
import { StatManager } from "./stats";
import { botColor } from "./util";

export class ChestManager extends InteractiveElementManager {
  protected static elementName = "chest";

  static Create(channel: TextChannel, id: string) {
    const chest = ChestManager.data[id] as ChestData;

    const hasCost = Object.keys(chest.cost).length > 0;
    const costString = hasCost
      ? Object.keys(chest.cost)
          .map((stat) => MemberStats[stat].icon)
          .join("")
      : "";

    const row = new MessageActionRow().addComponents(
      ChestManager.CreateButton(id, "open", hasCost ? `Open (${costString})` : "Open", hasCost ? "PRIMARY" : "SUCCESS")
    );
    channel.send({ files: [`./images/chests/${id}/closed.png`], components: [row] });
    console.log(`Chest (${id}) spawned`);
  }

  protected static async Use(i: ButtonInteraction, action: string, id: string) {
    const chest = ChestManager.data[id] as ChestData;

    const member = await i.guild?.members.fetch(i.member?.user.id as string);
    if (!member) return;

    // cooldown
    if (chest.cooldown) {
      const remaining = (await chest.cooldown?.GetRemainingTime(member)) || 0;

      if (remaining > 0) {
        i.reply({
          content: `You can open more chests in **${chest.cooldown?.GetTimeString(remaining)}**.`,
          ephemeral: true,
        });
        return;
      }
      chest.cooldown?.Trigger(member);
    }

    // validate
    for await (const [stat, cost] of Object.entries(chest.cost)) {
      if ((await StatManager.GetStat(member, stat)) < cost) {
        i.reply({ content: "You don't have enough to open this chest.", ephemeral: true });
        return;
      }
      StatManager.AdjustStat(member, stat, -cost);
    }

    // open chest
    const msg = i.message as Message;
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("nope").setLabel(`Claimed by ${member.displayName}`).setStyle("DANGER").setDisabled(true)
    );
    const statsRow = new MessageActionRow().addComponents(StatManager.CreateButton(member.id, "view", `View ${member.displayName}'s stats`, "SECONDARY"));
    msg.edit({ files: [`./images/chests/${id}/open.png`], components: [row, statsRow] }).catch(console.log);

    // get loot
    const loot = chest.possibleContents();
    const embed = new MessageEmbed().setTitle("Contents").setColor(botColor);
    for (const [key, value] of Object.entries(loot)) {
      if (value === 0) continue;
      const stat = MemberStats[key];
      embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
      await StatManager.AdjustStat(member, key, value);
    }
    const statsEmbed = await StatManager.GetEmbed(member, ["coins", "bombs", "keys"]);
    i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
    console.log(`Chest (${id}) opened by ${member.displayName}`);
  }
}

export const InitializeChests = (client: Client) => {
  ChestManager.Initialize(client, chests, [
    process.env.CHANNEL_CHAT as string,
    process.env.CHANNEL_CHESTS as string,
    process.env.CHANNEL_SECRET as string,
    process.env.CHANNEL_ERROR as string,
  ]);

  const channel = client.channels.cache.get(process.env.CHANNEL_CHESTS as string) as TextChannel;
  setInterval(() => {
    if (Math.random() < 0.0075) {
      if (Math.random() > 0.15) ChestManager.Create(channel, "common");
      else ChestManager.Create(channel, Math.random() < 0.5 ? "gold" : "stone");
    }
  }, 1000 * 60);
};
