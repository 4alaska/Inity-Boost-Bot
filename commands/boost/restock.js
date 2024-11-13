const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require("../../config.json");
const { devOnly } = require('./boost');


const tokenFilePath1m = path.join(__dirname, '../../stock/1m.txt');
const tokenFilePath3m = path.join(__dirname, '../../stock/3m.txt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restock')
        .setDescription('Recharge des tokens dans le stock 1 mois ou 3 mois')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de token à restocker')
                .setRequired(true)
                .addChoices(
                    { name: '1 Month', value: '1m' },
                    { name: '3 Month', value: '3m' }
                )
        )
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Fichier contenant les nouveaux tokens')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


        devOnly: true,
    run: async(client, interaction) => {
        const type = interaction.options.getString('type');
        const file = interaction.options.getAttachment('file');

        
        if (!file.name.endsWith('.txt')) {
            return interaction.reply({ content: 'Veuillez fournir un fichier .txt.', ephemeral: true });
        }

        
        const targetFilePath = type === '1m' ? tokenFilePath1m : tokenFilePath3m;

        
        const response = await fetch(file.url);
        const newTokens = await response.text();

        
        const tokensToAdd = newTokens.split('\n').map(token => token.trim()).filter(token => token);
        const existingTokens = fs.readFileSync(targetFilePath, 'utf-8').split('\n').map(token => token.trim()).filter(token => token);
        const updatedTokens = Array.from(new Set([...existingTokens, ...tokensToAdd]));

        
        fs.writeFileSync(targetFilePath, updatedTokens.join('\n'));

        const stockEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji.main} Restock Complété`)
            .setDescription(`Le stock de tokens pour ${type === '1m' ? '1 mois' : '3 mois'} a été mis à jour avec succès.`)
            .addFields(
                { name: 'Tokens ajoutés', value: `${tokensToAdd.length}`, inline: true },
                { name: 'Total des tokens', value: `${updatedTokens.length}`, inline: true }
            )
            .setColor(config.embed.color)
            .setImage('https://share.creavite.co/670a78e37b08427e2459b423.gif')
            .setTimestamp()
            .setFooter({text: `Service provided by inityservices`})

        await interaction.reply({ embeds: [stockEmbed] });
    }
};
