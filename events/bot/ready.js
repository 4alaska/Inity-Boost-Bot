const { Events, ActivityType, Status } = require('discord.js')
const { client } = require('../../index')
const { blue, greenBright, redBright, yellow } = require("cli-color");
const config = require("../../config.json")
const bot = require('../../index')
const { morning, atlas } = require('gradient-string');

client.on(Events.ClientReady, async () => {
    client.application.commands.set(client.commands.map((cmd) => cmd.data));

    let type;
    let url;
    if (config.bot.status.type === "PLAYING") type = ActivityType.Playing
    if (config.bot.status.type === "STREAMING") {
        if (!config.bot.status.url) return console.log(redBright.bold("Veuillez ajouter une url dans le fichier ./config.json"))
        type = ActivityType.Streaming, url = config.bot.status.url
    }
    if (config.bot.status.type === "LISTENING") type = ActivityType.Listening
    if (config.bot.status.type === "COMPETING") type = ActivityType.Competing

    client.user.setPresence({
        activities: [{ name: config.bot.status.activite, type: type, url: url }],
        status: Status.Idle,
    });

    console.log(morning(" ------------------------ "));
    console.log(morning(`>> ${client.user.tag} est connecté à discord !`));
    console.log(morning(`>> ${client.guilds.cache.size} serveurs ! <<`));
    console.log(morning(`>> ${client.users.cache.size} utilisateurs ! <<`));
    console.log(morning(`>> ${client.channels.cache.size} salons ! <<`));
    console.log(morning(" ------------------------ "));
})





