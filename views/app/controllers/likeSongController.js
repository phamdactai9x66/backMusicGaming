const modelLikeSong = require("../models/likeSong");
const song = require('../models/song');
const { statusS, statusF } = require("../validator/variableCommon");
let mongoose = require("mongoose");

class likeSong {
  index(req, res, next) {
    let { id_Songs, id_User } = req.query;
    let condition = {
    }
    if (id_Songs) {
      condition = {
        ...condition, id_Songs: mongoose.Types.ObjectId(id_Songs)
      }
      if (id_User) {
        condition = {
          ...condition, id_User: mongoose.Types.ObjectId(id_User)
        }
      }
    }
    if (id_User) {
      condition = {
        ...condition, id_User: mongoose.Types.ObjectId(id_User)
      }
      if (id_Songs) {
        condition = {
          ...condition, id_Songs: mongoose.Types.ObjectId(id_Songs)
        }
      }
    }

    if(id_User){
      condition={...condition, id_User: mongoose.Types.ObjectId(id_User)}
    }

    modelLikeSong.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get failed.",
          status: statusF,
          data: [],
        });
      } else {
        return res.json({
          message: "Get successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  async create(req, res) {

    let { id_User: idU, id_Songs: idS } = req.body;
    if (!idU || !idS) {
      return res.json({
        status: statusF,
        data: [],
        message: `We don't allow field is blank !`
      })
    }
    let findLikeSong = await modelLikeSong.find({
      id_User: mongoose.Types.ObjectId(idU),
      id_Songs: mongoose.Types.ObjectId(idS),
    })
    if (!findLikeSong.length) {
      let dataLikeSong = {
        id_User: mongoose.Types.ObjectId(idU),
        id_Songs: mongoose.Types.ObjectId(idS),
      }

      let createPlaylistSong = new modelLikeSong(dataLikeSong)
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
  async update(req, res) {
    let { id_User: idU, id_Songs: idS } = req.body;
    if (!idU || !idS) {
      return res.json({
        status: statusF,
        data: [],
        message: `We don't allow field is blank !`
      })
    }
    let dataLikeSong = {
      id_User: mongoose.Types.ObjectId(idU),
      id_Songs: mongoose.Types.ObjectId(idS),
    }

    let { idLikeSong } = req.params;
    const condition = {
      _id: mongoose.Types.ObjectId(idLikeSong)
    }

    modelLikeSong.findOneAndUpdate(condition, { $set: dataLikeSong }, { new: true })
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
      _id: mongoose.Types.ObjectId(req.params.idLikeSong)
    }
    modelLikeSong.findOneAndRemove(condition)
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
module.exports = new likeSong();
