const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChannelType
} = require("discord.js");

const GuildSettings =
    require("../models/GuildSettings");

const WikiPage =
    require("../models/WikiPage");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("wiki")
        .setDescription("Wiki System")

        .addSubcommand(sub =>
            sub
                .setName("setup")
                .setDescription(
                    "Wiki Kanal festlegen"
                )
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription(
                            "Wiki Kanal"
                        )
                        .addChannelTypes(
                            ChannelType.GuildText
                        )
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("create")
                .setDescription(
                    "Wiki Seite erstellen"
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("delete")
                .setDescription(
                    "Wiki Seite löschen"
                )
                .addStringOption(option =>
                    option
                        .setName("title")
                        .setDescription(
                            "Titel"
                        )
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("list")
                .setDescription(
                    "Alle Wiki Seiten anzeigen"
                )
        ),

    async execute(interaction) {

        const sub =
            interaction.options.getSubcommand();

        // ==========================
        // SETUP
        // ==========================

        if (sub === "setup") {

            if (
                !interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Nur Administratoren.",
                    ephemeral: true
                });

            }

            const channel =
                interaction.options.getChannel(
                    "channel"
                );

            await GuildSettings.findOneAndUpdate(

                {
                    guildId:
                        interaction.guild.id
                },

                {
                    guildId:
                        interaction.guild.id,

                    wikiChannelId:
                        channel.id
                },

                {
                    upsert: true
                }

            );

            return interaction.reply({

                content:
                    `✅ Wiki Kanal gesetzt auf ${channel}`,

                ephemeral: true

            });

        }

        // ==========================
        // CREATE
        // ==========================

        if (sub === "create") {

            if (
                !interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Nur Administratoren.",
                    ephemeral: true
                });

            }

            const modal =
                new ModalBuilder()
                    .setCustomId(
                        "wiki_create"
                    )
                    .setTitle(
                        "Wiki Seite erstellen"
                    );

            const titleInput =
                new TextInputBuilder()
                    .setCustomId(
                        "title"
                    )
                    .setLabel(
                        "Titel"
                    )
                    .setStyle(
                        TextInputStyle.Short
                    )
                    .setRequired(true)
                    .setMaxLength(100);

            const triggerInput =
                new TextInputBuilder()
                    .setCustomId(
                        "triggers"
                    )
                    .setLabel(
                        "Trigger Wörter"
                    )
                    .setPlaceholder(
                        "bewerben,bewerbung,apply"
                    )
                    .setStyle(
                        TextInputStyle.Short
                    )
                    .setRequired(false)
                    .setMaxLength(500);

            const content1Input =
                new TextInputBuilder()
                    .setCustomId(
                        "content1"
                    )
                    .setLabel(
                        "Content 1"
                    )
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setRequired(true)
                    .setMaxLength(4000);

            const content2Input =
                new TextInputBuilder()
                    .setCustomId(
                        "content2"
                    )
                    .setLabel(
                        "Content 2"
                    )
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setRequired(false)
                    .setMaxLength(4000);

            modal.addComponents(

                new ActionRowBuilder()
                    .addComponents(
                        titleInput
                    ),

                new ActionRowBuilder()
                    .addComponents(
                        triggerInput
                    ),

                new ActionRowBuilder()
                    .addComponents(
                        content1Input
                    ),

                new ActionRowBuilder()
                    .addComponents(
                        content2Input
                    )

            );

            return interaction.showModal(
                modal
            );

        }

        // ==========================
        // DELETE
        // ==========================

        if (sub === "delete") {

            if (
                !interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Nur Administratoren.",
                    ephemeral: true
                });

            }

            const title =
                interaction.options
                    .getString("title")
                    .toLowerCase();

            const page =
                await WikiPage.findOne({

                    guildId:
                        interaction.guild.id,

                    title

                });

            if (!page) {

                return interaction.reply({

                    content:
                        "❌ Wiki Seite nicht gefunden.",

                    ephemeral: true

                });

            }

            await WikiPage.deleteOne({

                guildId:
                    interaction.guild.id,

                title

            });

            return interaction.reply({

                content:
                    `🗑️ Wiki Seite **${title}** gelöscht.`,

                ephemeral: true

            });

        }

        // ==========================
        // LIST
        // ==========================

        if (sub === "list") {

            const pages =
                await WikiPage.find({

                    guildId:
                        interaction.guild.id

                }).sort({
                    title: 1
                });

            if (!pages.length) {

                return interaction.reply({

                    content:
                        "📚 Keine Wiki Seiten vorhanden."

                });

            }

            const list =
                pages
                    .map(page =>
                        `• ${page.title}`
                    )
                    .join("\n");

            return interaction.reply({

                content:
                    `📚 Wiki Seiten\n\n${list}`

            });

        }

    }

};