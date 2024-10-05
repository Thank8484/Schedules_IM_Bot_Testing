const { EmbedBuilder, Client, GatewayIntentBits, time } = require("discord.js");
const { cronSubjects } = require("./config.json");
require("dotenv/config");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const TOKEN = process.env.TOKEN;
const cron = require("node-cron");
const channelID = process.env.CHANNELID;

client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

function sendMessage(message, embedTitle) {
  const channel = client.channels.cache.get(channelID);
  const embed = new EmbedBuilder().setTitle(embedTitle).setColor("#0099ff");
  channel
    .send({
      content: `@everyone, ${message}`,
      username: "Aj Mae",
      avatarURL:
        "https://cdn.discordapp.com/attachments/1000316548294131743/1210143533994872902/1657968265232.jpg?ex=66ff00bd&is=66fdaf3d&hm=cab619c37ddfa2ed3fc8e1d3fc6a5b2e3fcc00666a401381dd76e0ed1ca4dc63&",
      embeds: [embed],
    })
    .then(() => {
      console.log("Message sent: " + message);
    })
    .catch((error) => {
      console.error("Error trying to send message:", error);
    });
}

try {
  for (const key in cronSubjects) {
    if (Object.prototype.hasOwnProperty.call(cronSubjects, key)) {
      const daySubjects = cronSubjects[key];

      daySubjects.forEach((subject) => {
        console.log(
          `Register Cron job: ${subject.name} at ${subject.time} on ${key}`
        );
        cron.schedule(subject.cron, () => {
          sendMessage(`${subject.time} ${subject.name}`, subject.name);
        });
      });
    }
  }
  cron.schedule("30 * * * *", () => {
    console.log(`Bot still runing`);
  });
} catch (error) {
  console.error("Error occurred in cron schedule setup:", error);
}
