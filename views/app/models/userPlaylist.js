const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const userPlaylist = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 255
    },
    id_User: {
        type: Schema.ObjectId
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("userPlaylist", userPlaylist);