const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

let maxLogs = 6; 
let savedLogs = []; 
let totalLeft = 0; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaveall')
        .setDescription('Fait quitter le bot de tous les serveurs sauf celui où la commande est exécutée.'),
    run: async (client, interaction) => {
        try {
           
            const currentGuildId = interaction.guild.id;
            const totalGuilds = client.guilds.cache.size - 1; 

           
            const embed = new EmbedBuilder()
                .setColor(config.embed.color)
                .setTitle(`${config.emoji.main} Départ des serveurs en cours... 0/${totalGuilds}`)
                .setDescription(`Le bot quitte tous les serveurs sauf celui-ci.`)
                .setImage('https://share.creavite.co/670a78e37b08427e2459b423.gif')
            	.setTimestamp()
            	.setFooter({text: `Service provided by inityservices`})

           
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            
            for (const guild of client.guilds.cache.values()) {
                if (guild.id === currentGuildId) continue;

                try {
                    await new Promise((resolve) => setTimeout(resolve, 5000)); 
                    await guild.leave();
                    totalLeft++;

                   
                    let newLog = `[+] Le bot a quitté : ${guild.name}`;
                    if (savedLogs.length >= maxLogs) {
                        savedLogs.pop(); 
                    }
                    savedLogs.unshift(newLog); 

                   
                    const updatedEmbed = EmbedBuilder.from(embed)
                        .setTitle(`Départ des serveurs en cours... ${totalLeft}/${totalGuilds}`)
                        .setDescription(`Le bot quitte tous les serveurs sauf celui-ci.`)
                        .setTimestamp();

                    
                    if (savedLogs.length > 0) {
                        const logsText = savedLogs.join('\n');
                        updatedEmbed.addFields({ name: "Logs", value: "```\n" + logsText + "\n```", inline: false });
                    }

                   
                    await message.edit({ embeds: [updatedEmbed] });

                } catch (error) {
                    console.error(`Erreur en quittant le serveur ${guild.name}: ${error}`);
                }
            }

           
            const finalEmbed = EmbedBuilder.from(embed)
                .setTitle(`Départ terminé ! ${totalLeft}/${totalGuilds}`)
                .setDescription(`Le bot a quitté tous les serveurs sauf celui-ci.`)
                .setImage('https://share.creavite.co/670a78e37b08427e2459b423.gif')
            	.setTimestamp()
            	.setFooter({text: `Service provided by inityservices`})

            await message.edit({ embeds: [finalEmbed] });

        } catch (error) {
            console.error('Erreur lors de la commande leaveall:', error.message);
            await interaction.reply({
                content: `⚠️ Une erreur est survenue : ${error.message}`,
                ephemeral: true,
            });
        }
    },
};
