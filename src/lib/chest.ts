import { ButtonInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { MemberStats } from "./data/stats";
import { AdjustMemberStat, GetMemberStatsEmbed } from "./memberStats";

const chestButtonId = "open-chest";
let lastOpened = "0";

export const initializeChestGenerator = (client: Client) => {
  setInterval(() => {
    if (Math.random() < 0.014) spawnChest(client);
  }, 1000 * 60 * 10);
  createChestButtonCollector(client);
};

const createChestButtonCollector = (client: Client) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  if (!channel) return;

  const collector = channel.createMessageComponentCollector({ filter: (i) => i.customId === chestButtonId });
  collector.on("collect", (i) => openChest(i as ButtonInteraction));
};

const openChest = async (i: ButtonInteraction) => {
  const member = await i.guild?.members.fetch(i.member?.user.id as string);
  if (!member) return;

  // validate
  if (lastOpened == member.id) {
    i.reply({ content: "You already opened the last chest. Give another person a chance!", ephemeral: true }).catch(console.log);
    return;
  }
  lastOpened = member.id;

  // open chest
  const msg = i.message as Message;
  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("nope").setLabel(`Claimed by ${member.displayName}`).setStyle("DANGER").setDisabled(true),
    new MessageButton().setCustomId(member.id).setLabel(`View ${member.displayName}'s stats`).setStyle("SECONDARY")
  );
  msg.edit({ files: ["https://moddingofisaac.com/img/chest_open.png?v=3"], components: [row] }).catch(console.log);
  console.log(`Chest opened by ${member.displayName}`);

  // get loot
  const loot = getLoot();
  const embed = new MessageEmbed().setTitle("Contents");
  for (const [key, value] of Object.entries(loot)) {
    if (value === 0) continue;
    const stat = MemberStats[key];
    embed.addField(stat.name, `${stat.icon} x **${value}**`, true);
    AdjustMemberStat(member, key, value);
  }
  const statsEmbed = await GetMemberStatsEmbed(member);
  i.reply({ embeds: [embed, statsEmbed], ephemeral: true }).catch(console.log);
};

const getLoot = () => {
  const loot = { coins: 0, bombs: 0, keys: 0 };
  for (let i = 0; i < 2; i++) {
    const rand = Math.floor(Math.random() * 3);
    switch (rand) {
      case 0: {
        loot.coins += Math.ceil(Math.random() * 3);
        break;
      }
      case 1:
        loot.bombs += 1;
        break;
      case 2:
        loot.keys += 1;
        break;
    }
  }
  return loot;
};

export const spawnChest = (client: Client) => {
  const channel = client.channels.cache.get(process.env.CHANNEL_CHAT as string) as TextChannel;
  if (!channel) return;

  const row = new MessageActionRow().addComponents(new MessageButton().setCustomId(chestButtonId).setLabel("Open").setStyle("SUCCESS"));
  channel.send({ files: ["https://moddingofisaac.com/img/chest_closed.png?v=3"], components: [row] });
  console.log("Chest spawned");
};
