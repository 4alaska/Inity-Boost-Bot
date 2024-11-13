const { Events, InteractionType, Collection } = require('discord.js')
const { client } = require('../../index')
const config = require('../../config.json')

client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName)

    if (!cmd) return interaction.reply({ content: `${config.emoji.bad} Cette commande ne semble pas exister !`, ephemeral: true });

    
    if (cmd.devOnly && !config.bot.admin.includes(interaction.user.id)) {
        return interaction.reply({ content: `${config.emoji.bad} Commande uniquement pour les developpers !`, ephemeral: true });
    }

    

    cmd.run(client, interaction)
})



