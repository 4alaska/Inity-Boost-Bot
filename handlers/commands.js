const { readdirSync } = require('fs');
const {greenBright, redBright, yellow} = require("cli-color");

module.exports = client => {

    console.log(yellow.underline("Chargement des commandes..."))

    const dirscmd = readdirSync('./commands/')

    for (const dirsdoss of dirscmd) {
        console.log(yellow.bold(`> ${dirsdoss}`))

        const filesdirs = readdirSync(`./commands/${dirsdoss}/`).filter(file => file.endsWith('.js'))

        for(const files of filesdirs) {
            const cmd = require(`../commands/${dirsdoss}/${files}`)
            
            if(!cmd.data) return console.log(redBright(`  > La commande ${files} n'a pas de nom !`))
            cmd.category = dirsdoss.toLowerCase();
        
            client.commands.set(cmd.data.name, cmd)

            console.log(yellow(`  > ${files}`))

        }
    }
}
