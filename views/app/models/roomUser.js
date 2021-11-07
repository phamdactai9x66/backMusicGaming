const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const roomUser = new Schema(
  {
    id_Room: {
      type: Schema.ObjectId,
    },
    id_User: {
      type: Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("room-users", roomUser);