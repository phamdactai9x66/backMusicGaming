const modelPlaylistSong = require("../models/playlistSong");
const modelPlaylist = require("../models/playlist");
const song = require('../models/song');
const { statusS, statusF } = require("../validator/methodCommon");
let mongoose = require("mongoose");

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
        return res.json({
          message: "Get playlistsong successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  getOne(req, res){
    let {idPlaylistSong} = req.params;
    let condition = {
      _id: mongoose.Types.ObjectId(idPlaylistSong)
    }
    modelPlaylistSong.findById(condition).exec((err, resp) => {
      if (err || !resp) {
        return res.json({
            status: statusF,
            data: [],
            message: `We have some error:${resp}`
        })
      } else {
        return res.json({
            status: statusS,
            data: resp,
            message: ``
        })
      }
    })
  }
  async createPlaylistSong(req, res) {

    try {
      let { id_Playlist: idPl, id_Songs: idS  } = req.body;
      let findPlaylist = await modelPlaylist.find({ _id: mongoose.Types.ObjectId(idPl) })
      let findSong = await song.find({ _id: mongoose.Types.ObjectId(idS) })

      if (findPlaylist.length && findSong.length) {

        let dataPlaylistSong = {
          id_PlayList: mongoose.Types.ObjectId(idPl),
          id_Songs: mongoose.Types.ObjectId(idS),
        }

        let createPlaylistSong = await new modelPlaylistSong(dataPlaylistSong)
        createPlaylistSong.save((err, data) => {
          if (err) {
            res.json({
                status: statusF,
                message: `We have few error: ${err}`
            })
        } else {
            res.json({
                status: statusS,
                data: data,
                message: "Add Successfully"
            })
        }
        });
      
    }
    } catch (error) {
      res.json({
        status: statusF,
        data: [], 
        error: error
    })
    }
  }
  async updatePlaylistSong(req, res) {
    try {
      let { id_Playlist: idPl, id_Songs: idS  } = req.body;
      let findPlaylist = await modelPlaylist.find({ _id: mongoose.Types.ObjectId(idPl) })
      let findSong = await song.find({ _id: mongoose.Types.ObjectId(idS) })

      if (findPlaylist.length && findSong.length) {

        let dataPlaylistSong = {
          id_PlayList: mongoose.Types.ObjectId(idPl),
          id_Songs: mongoose.Types.ObjectId(idS),
        }

        let idPlaylistSong = req.params.idPlaylistSong;
        const condition = {
            _id: mongoose.Types.ObjectId(idPlaylistSong)
        }
        
        modelPlaylistSong.findOneAndUpdate(condition, { $set: dataPlaylistSong }, { new: true })
          .exec((err, new_data) => {
            if (err) {
              res.json({
                status: "failed",
                message: `We have few error: ${err}`
              })
            } else {
              res.json({
                status: "successfully",
                data: [new_data],
                message: `You were update successfully`
              })

            }
          })
      }
    } catch (error) {
      res.json({
        status: statusF,
        data: [], 
        error: error
    })
    }
  }
  delete(req, res) {
    const condition = {
        _id: mongoose.Types.ObjectId(req.params.idPlaylistSong)
    }
    modelPlaylistSong.findOneAndRemove(condition)
        .exec((err) => {
            if (err) {
                res.json({
                    status: "failed",
                    message: `We have few error: ${err}`
                })
            } else {
                res.json({
                    status: "successfully",
                    data: {}
                })
            }
        })

}
}
module.exports = new playlistSong();
