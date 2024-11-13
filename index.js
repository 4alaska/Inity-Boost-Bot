const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config.json')
const hevents = require('./handlers/events')
const hcommands = require('./handlers/commands')
const InviteManager = require("discord-invite")


const { greenBright, redBright, yellow } = require("cli-color");
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.User, Partials.Reaction, Partials.Message, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember],
});
const invClient = new InviteManager(client);
module.exports = invClient;

client.commands = new Collection()
client.config = require('./config.json')

console.log(greenBright.underline("Lancement du bot"))

client.setMaxListeners(0)

module.exports.client = client;


hcommands(client)
hevents(client)


client.login(config.bot.token).catch((reason) => {
    console.log(redBright.bold("La connection à discord à échoué !"));
    switch (reason.code) {
        case "ENOTFOUND":
            console.log(redBright("> Erreur de connection (vérifier votre connection à internet) !"));
            break;
        case "TokenInvalid":
            console.log(redBright("> Token invalide (vérifier votre token sur https://discord.com/developers/applications et dans le fichier ./config.json) !"));
            break;
    }
});


process.on("uncaughtException", (e) => {
    if (e.code === 50013) return;
     if (e.code === 50001) return;
     if (e.code === 50035) return;
     if (e.code === 10062) return;
   
     console.log(e)
 })



