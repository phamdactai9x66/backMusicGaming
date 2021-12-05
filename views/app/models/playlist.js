const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const playlist = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection theme
    name: {
        type: String, maxLength: 255, require: true, trim: true
    },
    image: { type: String, default: "" },
    passed: { type: Boolean, default: false}
}, {
    timestamps: true
})
module.exports = mongoose.model("playlist", playlist);