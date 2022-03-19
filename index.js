const { Player } = require('discord-player');
const { Client, Intents } = require('discord.js');

const client = new Client({
    shards: "auto",
    restTimeOffset: 0,
    intents: 641,
    partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"]
})

const config = require('./config.json');
let prefix = config.prefix;

client.on('ready', () => {
    console.log(`GoaL Music Aktif`);
    client.user.setActivity(`g!play`, { type: "PLAYING" });
})

const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 5000,
    autoSelfDeaf: true,
    initialVolume: 80,
    bufferingTimeout: 3000
});

module.exports = {client , player };
//require('./events')(client)

client.on('messageCreate', (message) => {
    if (!message.guild || message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let cmd = args.shift().toLowerCase();

    require('./cmd')(client, message, args, cmd)
});

client.login(config.token)