# INITY SERVICES BOT API

## Information

Boost bot & API entièrement développé par **4alaska**. Si vous souhaitez du support ou vous voulez payer notre API, Rejoignez notre sur notre [Discord](https://discord.gg/inityservices)


## Fonctionnalités

- 💎 Boostez rapidement les serveurs Discord
- 📌 Prend en charge les T0K3NS de 1 mois et 3 mois
- 🔮 WaterMark des T0K3N (bio et surnom pour l'instant)
- 🚀 Personnalisation complète du bot
- 💻 Bot de boost open source – communique directement avec l'API pour une flexibilité maximale !
- 🔑 Intégration avec les API SELLIX, SELLAUTH et SELLPASS (bientôt disponible)


## Commandes

- `/boost (guild ID) (type 1m or 3m) (nombre) (bio)* (nickname)* ` - Boost via notre api
- `/restock (type 1m or 3m)` - Permet de restock les fichiers 1m.txt et 3m.txt
- `/stock` - Afficher le stock du bot

## Gestion du stock

- Format : `token`. Vous devez uniquement mettre 1 token par ligne.

## Configurer vos informations dans : `config.json`

```json
{
   "bot": {
        "token": "",
        "client_id": "",
        "admin": [""], 
        "status": {
            "activite": "",
            "type": "STREAMING",
            "url": "https://www.twitch.tv/4alaska"
        },
        "apikey": ""
    },
    "emoji": {
        "main": "<:inityservices:1282301988033527881>"
    },
    "embed": {
        "color": "#e25ae4"
    }
}
