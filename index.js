const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const mongoose =
    require("mongoose");

const fs =
    require("fs");

const client =
    new Client({

        intents: [

            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent

        ]

    });

client.commands =
    new Collection();

// ==========================
// Railway Variablen
// ==========================

const TOKEN =
    process.env.TOKEN;

const MONGO_URI =
    process.env.MONGO_URI;

if (!TOKEN) {

    console.error(
        "TOKEN Variable fehlt."
    );

    process.exit(1);

}

if (!MONGO_URI) {

    console.error(
        "MONGO_URI Variable fehlt."
    );

    process.exit(1);

}

// ==========================
// MongoDB
// ==========================

mongoose.connect(MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB verbunden."
        );

    })

    .catch(error => {

        console.error(
            "MongoDB Fehler:",
            error
        );

    });

// ==========================
// Commands laden
// ==========================

const commandFiles =
    fs.readdirSync("./commands")
        .filter(file =>
            file.endsWith(".js")
        );

for (const file of commandFiles) {

    const command =
        require(
            `./commands/${file}`
        );

    client.commands.set(
        command.data.name,
        command
    );

}

// ==========================
// Events laden
// ==========================

const eventFiles =
    fs.readdirSync("./events")
        .filter(file =>
            file.endsWith(".js")
        );

for (const file of eventFiles) {

    const event =
        require(
            `./events/${file}`
        );

    if (event.once) {

        client.once(

            event.name,

            (...args) =>
                event.execute(
                    ...args,
                    client
                )

        );

    } else {

        client.on(

            event.name,

            (...args) =>
                event.execute(
                    ...args,
                    client
                )

        );

    }

}

// ==========================
// Login
// ==========================

client.login(TOKEN);