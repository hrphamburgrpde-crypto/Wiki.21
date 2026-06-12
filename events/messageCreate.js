const {
    EmbedBuilder
} = require("discord.js");

const GuildSettings =
    require("../models/GuildSettings");

const WikiPage =
    require("../models/WikiPage");

module.exports = {
    name: "messageCreate",

    async execute(message) {

        if (message.author.bot) return;
        if (!message.guild) return;

        try {

            const settings =
                await GuildSettings.findOne({
                    guildId: message.guild.id
                });

            if (!settings) return;

            if (
                settings.wikiChannelId !==
                message.channel.id
            ) {
                return;
            }

            const search =
                message.content
                    .toLowerCase()
                    .trim();

            if (!search.length) return;

            // Nur einzelne Begriffe erlauben
            if (
                search.length > 50 ||
                search.includes(" ")
            ) {
                return;
            }

            const page =
                await WikiPage.findOne({

                    guildId:
                        message.guild.id,

                    $or: [
                        {
                            title: search
                        },
                        {
                            triggers: search
                        }
                    ]

                });

            // ==========================
            // KEINE WIKI GEFUNDEN
            // ==========================

            if (!page) {

                const embed =
                    new EmbedBuilder()
                        .setTitle(
                            "❌ Keine Wiki gefunden"
                        )
                        .setDescription(
                            "Zu dieser Frage wurde leider keine Wiki gefunden."
                        );

                const botMessage =
                    await message.reply({
                        embeds: [embed]
                    });

                setTimeout(async () => {

                    try {

                        await message.delete()
                            .catch(() => {});

                        await botMessage.delete()
                            .catch(() => {});

                    } catch (err) {

                        console.error(err);

                    }

                }, 10000);

                return;
            }

            // ==========================
            // WIKI GEFUNDEN
            // ==========================

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        `📚 ${page.title}`
                    )
                    .setDescription(
                        page.content
                    )
                    .setFooter({
                        text: "Wiki"
                    })
                    .setTimestamp();

            const botMessage =
                await message.reply({
                    embeds: [embed]
                });

            setTimeout(async () => {

                try {

                    await message.delete()
                        .catch(() => {});

                    await botMessage.delete()
                        .catch(() => {});

                } catch (err) {

                    console.error(err);

                }

            }, 100000);

        } catch (error) {

            console.error(error);

        }

    }
};