const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const artist = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection theme
    first_Name: {
        type: String, maxLength: 255, require: true, trim: true
    },
    last_Name: {
        type: String, maxLength: 255, require: true, trim: true
    },
    gender: { type: Boolean, default: false },
    birth: { type: Date },
    image: { type: String, default: "" }
}, {
    timestamps: true
})
module.exports = mongoose.model("artist", artist);