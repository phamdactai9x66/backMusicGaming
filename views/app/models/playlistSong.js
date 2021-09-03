const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const playlistSong = new Schema(
  {
    id_PlayList: {
      type: Schema.ObjectId,
    },
    id_Songs: {
      type: Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("playlist-songs", playlistSong);
