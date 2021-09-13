const modelPlaylistSong = require("../models/playlistSong");
const modelPlaylist = require("../models/playlist");
const song = require('../models/song');
const { statusS, statusF } = require("../validator/variableCommon");
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
  getOne(req, res) {
    let { idPlaylistSong } = req.params;
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

    let { id_PlayList: idPl, id_Songs: idS } = req.body;
    if (!idPl || !idS) {
      return res.json({
        status: statusF,
        data: [],
        message: `We don't allow field is blank !`
      })
    }
    let findPlaylist = await modelPlaylistSong.find({
      id_PlayList: mongoose.Types.ObjectId(idPl),
      id_Songs: mongoose.Types.ObjectId(idS)
    })
    if (!findPlaylist.length) {
      let dataPlaylistSong = {
        id_PlayList: mongoose.Types.ObjectId(idPl),
        id_Songs: mongoose.Types.ObjectId(idS),
      }

      let createPlaylistSong = new modelPlaylistSong(dataPlaylistSong)
      createPlaylistSong.save((err, data) => {
        if (err) {
          res.json({
            status: statusF,
            data: [],
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
    } else {
      res.json({
        status: statusF,
        data: [],
        message: `this playlist-song was exist`
      })
    }
  }
  async updatePlaylistSong(req, res) {
    let { id_PlayList: idPl, id_Songs: idS } = req.body;
    if (!idPl || !idS) {
      return res.json({
        status: statusF,
        data: [],
        message: `We don't allow field is blank !`
      })
    }
    let dataPlaylistSong = {
      id_PlayList: mongoose.Types.ObjectId(idPl),
      id_Songs: mongoose.Types.ObjectId(idS),
    }

    let { idPlaylistSong } = req.params;
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
