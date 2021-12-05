const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Blog = new Schema({
    title: {
        type: String, maxLength: 255, require: true, trim: true,
    },
    content: {
        type: String, require: true, trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    view: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        require: true,
    },
    id_User: {
        type: Schema.ObjectId,
    },
    id_CategoryBlog: {
        type: Schema.ObjectId,
    },
    link_Video: {
        type: String, trim: true, default: ''
    },
    passed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("blog", Blog);