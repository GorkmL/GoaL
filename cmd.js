const { Client, Message } = require("discord.js");
const { player } = require(".");
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */
module.exports = async (client, message, args, cmd) => {
    if (cmd === "ping") {
        message.channel.send(`>>> Ping : - \`${client.ws.ping}\``)
    }
    else if (cmd === "play") {
        let { channel } = message.member.voice;
        if (!channel) return message.channel.send(`>>> \`Ses Kanalına Katılmam Lazım! \``)

        let query = args.join(" ");
        if (!query) return message.channel.send(`>>> \`Lütfen Bana Şarkı Adı Veya Bağlantı Sağlayın. \` `
        );

        let queue = player.createQueue(message.guild.id,{
            metadata : {
                channel : channel,
            },
        });

                // verify vc connection
                try {
                    if (!queue.connection) await queue.connect(channel);
                } catch {
                    queue.destroy();
                    return await message.reply({ content: "Ses kanalınıza katılamadı!", ephemeral: true });
                }

                const track = await player.search(query,{
                    requestedBy : message.author
                }).then(r => r.tracks[0]);

                queue.play(track)
                message.channel.send({ content: `⏱️ | Parça yükleniyor **${track.title}!**
🎵 | Oynatılıyor **${track.title}**!`});
    }
    else if(cmd === "skip"){
        let queue = player.getQueue(message.guild.id);
        queue.skip()
        message.channel.send(`**Şarkı Atlandı**`)
    }
    else if(cmd === "pause"){
        let queue = player.getQueue(message.guild.id);
        queue.setPaused(true)
        message.channel.send(`**Şarkı Durduruldu**`)
    }
    else if(cmd === "resume"){
        let queue = player.getQueue(message.guild.id);
        queue.setPaused(false)
        message.channel.send(`**Şarkı Başlatıldı**`)
    }
    else if(cmd === "volume"){
        let queue = player.getQueue(message.guild.id);
        let amount = args[0];

        queue.setVolume(amount)
        message.channel.send(`**Ses Düzeyi**\`${amount}\``)
    }
};