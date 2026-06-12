const {
    REST,
    Routes
} = require("discord.js");

const config =
    require("../config/config.json");

const wiki =
    require("../commands/wiki");

const commands = [
    wiki.data.toJSON()
];

const rest =
    new REST({
        version: "10"
    }).setToken(
        config.token
    );

(async () => {

    try {

        console.log(
            "Registriere Commands..."
        );

        await rest.put(

            Routes.applicationCommands(
                config.clientId
            ),

            {
                body: commands
            }

        );

        console.log(
            "Commands registriert."
        );

    } catch (error) {

        console.error(error);

    }

})();