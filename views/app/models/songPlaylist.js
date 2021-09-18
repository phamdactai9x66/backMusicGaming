const mongoose = require("mongoose");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const songPlaylist = new Schema(
  {
    id_User_Playlist: {
      type: Schema.ObjectId,
    },
    id_Song: {
      type: Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("songPlaylist", songPlaylist);
