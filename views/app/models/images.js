const mongoose = require("mongoose");
// const slug= require("mongoose-slug-generator")
// mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const product = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection category
  title: { type: String, maxLength: 255, require: true, trim: true },
  url: { type: String },
  idProduct: { type: Schema.ObjectId }
}, {
  timestamps: true
})
module.exports = mongoose.model("image", product);