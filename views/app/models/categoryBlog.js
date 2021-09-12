const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const categoryBlog = new Schema({
    name: {
        type: String, maxLength: 255, require: true, trim: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("category-blog", categoryBlog);