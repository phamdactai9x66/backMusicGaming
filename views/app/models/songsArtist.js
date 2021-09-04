const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema; //generate variable references to mongoose schema

const songsArtist = new Schema(
  {
    id_Songs: {
      type: Schema.ObjectId,
    },
    id_Artist: {
      type: Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("songs-artist", songsArtist);
