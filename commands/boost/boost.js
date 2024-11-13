const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
const axios = require("axios");
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boost")
        .setDescription("Booster un serveur Discord")
        .addStringOption(option =>
            option.setName("guild")
                .setDescription("GUILD ID du serveur que vous voulez boost")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("type")
                .setDescription("Type de Token")
                .setRequired(true)
                .addChoices(
                    { name: "1 Mois", value: 1 },
                    { name: "3 Mois", value: 3 }
                )
        )
        .addIntegerOption(option =>
            option.setName("nombre")
                .setDescription("Le nombre de boost que vous voulez (doit être pair)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("bio")
                .setDescription("Bio personnalisée pour les boosters")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("nickname")
                .setDescription("Nickname personnalisée pour les boosters")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    devOnly: true,

    run: async (client, interaction) => {
        const guild = interaction.options.getString("guild");
        const type = interaction.options.getInteger("type");
        let nombre = interaction.options.getInteger("nombre");
        const bio = interaction.options.getString("bio") || "Boosté par le bot";
        const nickname = interaction.options.getString("nickname") || "Booster";

     if(!client.guilds.cache.get(guild)) return interaction.reply({content: `Le bot n'est pas sur le serveur spécifié !`, ephemeral: true}) 


    try {
        const apik = await axios.get(`https://api.inityservices.com/verifkey`, {
            params: { apikey: config.bot.apikey }
        });
        

        console.log(apik)

        

        if(!apik.data.success) return interaction.reply({content: `Votre api key est invalide !`, ephemeral: true}) 

    } catch (e) {
        console.log(e)
        return interaction.reply({content: `Une erreur est survenue lors de la verification de l'APIKEY, veuillez contacter le support.`, ephemeral: true})
    }

    


        if (nombre % 2 !== 0) {
            return interaction.reply("Le nombre de boosts doit être pair.");
        }


        const tokenFilePath = path.join(__dirname, `../../stock/${type === 1 ? '1m' : '3m'}.txt`);
        const successFilePath = path.join(__dirname, '../../stock/success.txt');
        const failedFilePath = path.join(__dirname, '../../stock/failed.txt');


        let tokens;
        try {
            tokens = fs.readFileSync(tokenFilePath, 'utf-8').trim().split('\n');
        } catch (err) {
            return interaction.reply("Erreur lors du chargement des tokens. Assurez-vous que le fichier de tokens existe.");
        }

        if (tokens.length < nombre / 2) {
            return interaction.reply("Pas assez de tokens disponibles pour ce boost.");
        }

        const boostsToPerform = nombre / 2;


        const boostEmbed = new EmbedBuilder()
            .setTitle(`${config.emoji.main} Boost du serveur en cours...`)
            .addFields(
                { name: `\`\`💎\`\` Boosts requis`, value: `**${nombre}**`, inline: true },
                { name: "\`\`✅\`\` Boosts réussis", value: `**0**/${nombre}`, inline: true },
                { name: "\`\`❌\`\` Boosts échoués", value: `**0**/${nombre}`, inline: true },
            )
            .setColor(config.embed.color)
            .setImage('https://share.creavite.co/670a78e37b08427e2459b423.gif')
            .setTimestamp()
            .setFooter({text: `Service provided by inityservices`})

        const message = await interaction.reply({ embeds: [boostEmbed], fetchReply: true });

        let boostCount = 0;
        let boostFailed = 0;

        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        let i = 0;
        while (i < boostsToPerform && tokens.length > 0) {
            const token = tokens.shift().trim(); 
            fs.writeFileSync(tokenFilePath, tokens.join('\n')); 

            console.log(`Starting request ${i + 1} with token ${token}`);

            let success = false;
            let attempt = 0;
            const maxAttempts = 3;

            while (!success && attempt < maxAttempts) {
                try {
                    attempt++;
                    const response = await axios.post("https://api.inityservices.com/boost", {
                        apikey: config.bot.apikey,
                        token: token,
                        guild: guild,
                        bio: bio,
                        nickname: nickname
                    });

                    console.log(`Request ${i + 1} completed with response:`, response.data);

                    

                    if (response.data.success) {
                        boostCount++;
                        fs.appendFileSync(successFilePath, `${token}\n`);
                        success = true;
                    } else {
                        boostFailed++;
                        fs.appendFileSync(failedFilePath, `${token}\n`);
                        success = true;
                    }
                } catch (error) {
                    console.error(`Request ${i + 1} failed with error:`, error.message);

                    if (attempt >= maxAttempts) {
                        boostFailed++;
                        fs.appendFileSync(failedFilePath, `${token}\n`);
                        success = true;
                    } else {
                        console.log(`Retrying request ${i + 1} (attempt ${attempt})...`);
                        await sleep(1000);
                    }
                }
            }

            const successPercentage = Math.round((boostCount / boostsToPerform) * 100);
            boostEmbed.setFields([
                { name: `\`\`💎\`\` Boosts requis`, value: `**${nombre}**`, inline: true },
                { name: "\`\`✅\`\` Boosts réussis", value: `**${boostCount * 2}**/${nombre}`, inline: true },
                { name: "\`\`❌\`\` Boosts échoués", value: `**${boostFailed * 2}**/${nombre}`, inline: true },
            ]);

            await message.edit({ embeds: [boostEmbed] });
            await sleep(1000);

            i++;
        }


        boostEmbed.setTitle(`${config.emoji.main} Boost terminé !`);
        await message.edit({ embeds: [boostEmbed] });


    }
};
