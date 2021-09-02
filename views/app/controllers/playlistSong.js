const modelPlaylistSong = require("../models/playlistSong");
const { statusS, statusF } = require("../validator/methodCommon");

class playlistSong {
  async index(req, res, next) {
    await modelPlaylistSong.find({}).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get playlistsong failed.",
          status: statusF,
          data: [],
        });
      } else {
        return res.json({
          message: "Get playlistsong successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
}
module.exports = new playlistSong();
