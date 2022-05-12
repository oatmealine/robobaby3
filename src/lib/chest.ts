import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { chests } from "./data/chests";
import { MemberStats } from "./data/stats";
import { AdjustMemberStat, GetMemberStat, GetMemberStatsEmbed } from "./memberStats";

export const initializeChestGenerator = (client: Client) => {
  setInterval(() => {
    if (Math.random() < 0.02) {
      if (Math.random() > 0.3) spawnChest(client, "common");
      else spawnChest(client, Math.random() < 0.5 ? "gold" : "stone");
    }
  }, 1000 * 60 * 9);
  createChestButtonCollector(client);
};

const createChestButtonCollector = (client: Client) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  if (!channel) return;

  const collector = channel.createMessageComponentCollector({ filter: (i) => i.customId.startsWith("open-") });
  collector.on("collect", (i) => openChest(i as ButtonInteraction, i.customId.split("-")[1]));
};

export const spawnChest = (client: Client, chestType: string) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  if (!channel) return;

  const hasCost = Object.keys(chests[chestType].cost).length > 0;
  const costString = hasCost
    ? Object.keys(chests[chestType].cost)
        .map((stat) => MemberStats[stat].icon)
        .join("")
    : "";

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`open-${chestType}`)
      .setLabel(hasCost ? `Open (${costString})` : "Open")
      .setStyle(hasCost ? "PRIMARY" : "SUCCESS")
  );
  channel.send({ files: [`./images/chests/${chestType}/closed.png`], components: [row] });
  console.log(`Chest (${chestType}) spawned`);
};

const openChest = async (i: ButtonInteraction, chestType: string) => {
  const member = await i.guild?.members.fetch(i.member?.user.id as string);
  if (!member) return;

  // validate
  for await (const [stat, cost] of Object.entries(chests[chestType].cost)) {
    if ((await GetMemberStat(member, stat)) < cost) {
      i.reply({ content: "You don't have enough to open this chest.", ephemeral: true });
      return;
    }
    AdjustMemberStat(member, stat, -cost);
  }

  // open chest
  const msg = i.message as Message;
  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("nope").setLabel(`Claimed by ${member.displayName}`).setStyle("DANGER").setDisabled(true),
    new MessageButton().setCustomId(member.id).setLabel(`View ${member.displayName}'s stats`).setStyle("SECONDARY")
  );
  msg.edit({ files: [`./images/chests/${chestType}/open.png`], components: [row] }).catch(console.log);

  // get loot
  const loot = chests[chestType].possibleContents();
  const embed = new MessageEmbed().setTitle("Contents");
  for (const [key, value] of Object.entries(loot)) {
    if (value === 0) continue;
    const stat = MemberStats[key];
    embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
    AdjustMemberStat(member, key, value);
  }
  const statsEmbed = await GetMemberStatsEmbed(member);
  i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
  console.log(`Chest (${chestType}) opened by ${member.displayName}`);
};
