const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const room = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection message
    nameRoom: {
        type: String, maxLength: 55, require: true, trim: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("room", room);