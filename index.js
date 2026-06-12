const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const mongoose =
require("mongoose");

const fs =
require("fs");

const path =
require("path");

const config =
require("./config/config.json");

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
// MongoDB
// ==========================

mongoose.connect(
    config.mongoUri
)
.then(() => {

    console.log(
        "MongoDB verbunden."
    );

})
.catch(console.error);


// ==========================
// Commands laden
// ==========================

const commandFiles =
fs.readdirSync(
    "./commands"
).filter(
    file => file.endsWith(".js")
);

for (
    const file
    of commandFiles
) {

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
fs.readdirSync(
    "./events"
).filter(
    file => file.endsWith(".js")
);

for (
    const file
    of eventFiles
) {

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

client.login(
    config.token
);