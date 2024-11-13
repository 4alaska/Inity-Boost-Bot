const { Events, InteractionType, Collection } = require('discord.js')
const { client } = require('../../index')
const config = require('../../config.json')

client.on(Events.InteractionCreate, async (interaction) => {

    if(!interaction.isAutocomplete()) return;

    const cmd = client.commands.get(interaction.commandName)

    cmd.autocomplete(client, interaction)

})



