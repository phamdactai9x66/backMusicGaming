const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const comment = new Schema(
  {
    title: {
      type: String, maxLength: 255, require: true, trim: true
    },
    rangeStart: {
        type: Number,
        min: [1, "the min length: 1"]
        , max: [5, "the max length:5"],
        default: 5
    },
    comment: {
        type: String, maxLength: 1000, require: true
    },
    state: {
        type: Boolean,
        default: 0
    },
    id_User: { 
        type: Schema.ObjectId 
    },
    id_Blog: { 
        type: Schema.ObjectId 
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("comment", comment);
