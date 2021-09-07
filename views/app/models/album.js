const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const album = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection theme
    title: {
        type: String, maxLength: 255, require: true, trim: true
    },
    image: {
        type: String
    },
    id_Artist: {
        type: Schema.ObjectId,
        require: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("album", album);