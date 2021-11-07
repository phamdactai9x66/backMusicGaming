const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const roomSong = new Schema(
  {
    id_Song: {
      type: Schema.ObjectId,
    },
    id_Room: {
      type: Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("room-songs", roomSong);