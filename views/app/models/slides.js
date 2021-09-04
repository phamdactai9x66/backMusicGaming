const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const slides = new Schema({
    name: {
        type: String, maxLength: 255, require: true, trim: true
    },
    image: { type: String },
    content: {
        type: String, maxLength: 1000, require: true, trim: true
    },
    id_Songs:{
        type: Schema.ObjectId
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("slide", slides);