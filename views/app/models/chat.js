const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const chat = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection message
    message: {
        type: String, maxLength: 1000, require: true, trim: true
    },
    firstName: {
        type: String, maxLength: 55, require: true, trim: true
    },
    lastName: {
        type: String, maxLength: 55, require: true, trim: true
    },
    idRoom: {
        type: Schema.ObjectId
    }
    ,
    idUser: {
        type: Schema.ObjectId
    },
    role: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("chat", chat);