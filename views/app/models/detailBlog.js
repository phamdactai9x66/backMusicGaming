const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const detailBlog = new Schema(
  {
    title: {
      type: String, maxLength: 255, require: true, trim: true
    },
    content: {
        type: String, require: true
    },
    image: {
        type: String
    },
    id_Blog: {
        type: Schema.ObjectId 
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("detail-blog", detailBlog);
