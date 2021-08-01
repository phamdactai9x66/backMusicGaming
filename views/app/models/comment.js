const mongoose = require("mongoose");
// const slug= require("mongoose-slug-generator")
// mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const comment = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection category
    id_Product: { type: Schema.ObjectId },
    id_User: { type: Schema.ObjectId },
    rangeStart: {
        type: Number,
        min: [1, "the min length: 1"]
        , max: [5, "the max length:5"],
        default: 5
    },
    title: {
        type: String,
        maxLength: 255
    },
    comment: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("comment", comment);