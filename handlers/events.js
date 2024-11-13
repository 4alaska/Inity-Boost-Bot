const { } = require('fs')
const {blue, redBright, yellow} = require("cli-color");
const { readdirSync } = require('fs');


module.exports = client => {

    console.log(blue.underline("Chargement des events..."))

    const dirsevent = readdirSync('./events/')

    for (const dirsdoss of dirsevent) {
        console.log(blue.bold(`> ${dirsdoss}`))

        const filesdirs = readdirSync(`./events/${dirsdoss}/`).filter(file => file.endsWith('.js'))

        for(const files of filesdirs) {
            
            const evt = require(`../events/${dirsdoss}/${files}`)
            console.log(blue(`  > ${files}`))
        }
    }
}