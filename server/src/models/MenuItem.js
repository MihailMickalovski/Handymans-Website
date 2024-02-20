const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        available: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("menuitems", MenuItemSchema);
