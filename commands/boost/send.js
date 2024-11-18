const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config.json');

const tokenFilePath1m = path.join(__dirname, '../../stock/1m.txt');
const tokenFilePath3m = path.join(__dirname, '../../stock/3m.txt');

const PASTEE_API_KEY = config.pasteee_api_key; 


function getTokens(filePath, count) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8').trim();
        const tokens = data.split('\n');
        return tokens.slice(0, count); 
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error.message);
        return [];
    }
}


function removeTokens(filePath, count) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8').trim();
        const tokens = data.split('\n');
        const remainingTokens = tokens.slice(count); 
        fs.writeFileSync(filePath, remainingTokens.join('\n'), 'utf-8'); 
    } catch (error) {
        console.error(`Erreur lors de la suppression des tokens dans le fichier ${filePath}:`, error.message);
    }
}


async function createPaste(tokens) {
    try {
        const response = await axios.post(
            'https://api.paste.ee/v1/pastes',
            {
                description: 'Tokens générés par Inity Services',
                sections: [
                    {
                        name: 'Tokens',
                        syntax: 'text',
                        contents: tokens.join('\n'),
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': PASTEE_API_KEY,
                },
            }
        );

        return response.data.link;
    } catch (error) {
        console.error('Erreur lors de la création du paste:', error.message);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Envoyer des tokens du stock sur un lien paste.ee')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type de tokens (1m ou 3m)')
                .setRequired(true)
                .addChoices(
                    { name: '1 Mois (1m)', value: '1m' },
                    { name: '3 Mois (3m)', value: '3m' }
                ))
        .addIntegerOption(option =>
            option
                .setName('nombre')
                .setDescription('Nombre de tokens à inclure dans le paste')
                .setRequired(true)),

    run: async (client, interaction) => {
        const type = interaction.options.getString('type');
        const nombre = interaction.options.getInteger('nombre');
        const filePath = type === '1m' ? tokenFilePath1m : tokenFilePath3m;

        
        const tokens = getTokens(filePath, nombre);
        if (tokens.length === 0) {
            return interaction.reply({
                content: `⚠️ Aucun token disponible ou erreur lors de la lecture du fichier.`,
                ephemeral: true,
            });
        }

        
        const pasteLink = await createPaste(tokens);
        if (!pasteLink) {
            return interaction.reply({
                content: `⚠️ Une erreur est survenue lors de la création du lien paste.ee.`,
                ephemeral: true,
            });
        }

        
        removeTokens(filePath, nombre);

       
        const stockEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji.main} Token envoyé !`)
            .addFields(
                { name: 'Type', value: type === '1m' ? '1 Mois (1m)' : '3 Mois (3m)', inline: true },
                { name: 'Nombre de Tokens', value: `${tokens.length}`, inline: true },
                { name: 'Lien paste.ee', value: `[Clique ici pour voir les tokens](${pasteLink})`, inline: false }
            )
            .setColor(config.embed.color)
            .setTimestamp()
            .setFooter({ text: 'Service provided by Inity Services' });

        await interaction.reply({ embeds: [stockEmbed] });
    },
};
