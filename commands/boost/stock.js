const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');


const tokenFilePath1m = path.join(__dirname, '../../stock/1m.txt');
const tokenFilePath3m = path.join(__dirname, '../../stock/3m.txt');


function countTokens(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8').trim();
        return data ? data.split('\n').length : 0;
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error.message);
        return 0;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Affiche le nombre de tokens disponibles pour les boosts de 1 mois et 3 mois'),

    run: async (client, interaction) => {
        
        const count1m = countTokens(tokenFilePath1m);
        const count3m = countTokens(tokenFilePath3m);

        
        const stockEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji.main} Stock`)
            .addFields(
                { 
                    name: '``💎`` B00st 1 Mois', 
                    value: `${count1m * 2}`, 
                    inline: false 
                },
                { 
                    name: '``📦`` T0k3ns 1 Mois', 
                    value: `${count1m}`, 
                    inline: false 
                } ,
                { 
                    name: '``💎`` B00st 3 Mois', 
                    value: `${count3m * 2}`, 
                    inline: false 
                },
                {
                    name: '``📦`` T0k3ns 3 Mois',
                    value: `${count3m}`,
                    inline: false
                }
            )
            .setColor(config.embed.color)
            .setImage('https://share.creavite.co/670a78e37b08427e2459b423.gif')
            .setTimestamp()
            .setFooter({text: `Service provided by inityservices`})

        
        await interaction.reply({ embeds: [stockEmbed] });
    }
};
