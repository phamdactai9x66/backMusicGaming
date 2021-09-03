const modelPlaylistSong = require("../models/playlistSong");
const { statusS, statusF } = require("../validator/methodCommon");
let mongoose = require("mongoose")

class playlistSong {
  index(req, res, next) {
    let { id_PlayList } = req.query;
    let condition = {
    }
    if (id_PlayList) {
      condition = {
        ...condition, id_PlayList: mongoose.Types.ObjectId(id_PlayList)
      }
    }

    modelPlaylistSong.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get playlistsong failed.",
          status: statusF,
          data: [],
        });
      } else {
        console.log(data);
        return res.json({
          message: "Get playlistsong successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  createPlaylist(req, res) {
    res.json({
      message: "xin chao"
    })
  }
}
module.exports = new playlistSong();
