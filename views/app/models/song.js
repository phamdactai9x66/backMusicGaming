const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const song = new Schema({
    title: {
        type: String, maxLength: 255, require: true, trim: true
    },
    image: { type: String, default: "" },
    view: {
        type: Number, default: 0
    },
    audio: { type: String },
    active: { type: Boolean, default: true },
    describe: {
        type: String
    },
    day_release: {
        type: String,
        require: true
    },
    id_Topic: {
        type: Schema.ObjectId
    },
    id_Categories: {
        type: Schema.ObjectId
    },
    id_album: {
        type: Schema.ObjectId
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("song", song);