const mongoose = require("mongoose");

const wikiPageSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        lowercase: true
    },

    content: {
        type: String,
        required: true
    },

    triggers: {
        type: [String],
        default: []
    },

    authorId: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "WikiPage",
    wikiPageSchema
);