const WikiPage = require("../models/WikiPage");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // ==========================
        // SLASH COMMANDS
        // ==========================

        if (interaction.isChatInputCommand()) {

            const command =
                client.commands.get(
                    interaction.commandName
                );

            if (!command) return;

            try {

                await command.execute(
                    interaction,
                    client
                );

            } catch (error) {

                console.error(error);

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    interaction.followUp({
                        content: "❌ Fehler.",
                        ephemeral: true
                    });

                } else {

                    interaction.reply({
                        content: "❌ Fehler.",
                        ephemeral: true
                    });

                }
            }
        }

        // ==========================
        // WIKI CREATE MODAL
        // ==========================

        if (!interaction.isModalSubmit()) return;

        if (
            interaction.customId !==
            "wiki_create"
        ) return;

        try {

            const title =
                interaction.fields
                    .getTextInputValue(
                        "title"
                    )
                    .toLowerCase()
                    .trim();

            const triggersRaw =
                interaction.fields
                    .getTextInputValue(
                        "triggers"
                    );

            const triggers =
                triggersRaw
                    .split(",")
                    .map(trigger =>
                        trigger
                            .trim()
                            .toLowerCase()
                    )
                    .filter(Boolean);

            const content1 =
                interaction.fields
                    .getTextInputValue(
                        "content1"
                    );

            const content2 =
                interaction.fields
                    .getTextInputValue(
                        "content2"
                    );

            const content =
                `${content1}\n\n${content2}`;

            const existingPage =
                await WikiPage.findOne({

                    guildId:
                        interaction.guild.id,

                    title

                });

            if (existingPage) {

                return interaction.reply({

                    content:
                        "❌ Eine Wiki Seite mit diesem Titel existiert bereits.",

                    ephemeral: true

                });

            }

            await WikiPage.create({

                guildId:
                    interaction.guild.id,

                title,

                content,

                triggers,

                authorId:
                    interaction.user.id

            });

            return interaction.reply({

                content:
                    `✅ Wiki Seite **${title}** erstellt.`,

                ephemeral: true

            });

        } catch (error) {

            console.error(error);

            return interaction.reply({

                content:
                    "❌ Fehler beim Speichern.",

                ephemeral: true

            });

        }

    }
};