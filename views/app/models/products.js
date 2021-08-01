const mongoose = require("mongoose");
// const slug= require("mongoose-slug-generator")
// mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const product = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection category
  name: { type: String, maxLength: 255, require: true, trim: true },
  quantity: { type: Number, default: 1, require: true },
  price: { type: Number, require: true },
  image: { extention: String, name_file: String },
  status: { type: Boolean, default: true },
  describe: { type: String, trim: true, default: "" },
  id_cate: { type: Schema.ObjectId }
}, {
  timestamps: true
})
module.exports = mongoose.model("product", product);