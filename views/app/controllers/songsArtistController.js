const songsArtistModel = require('../models/songsArtist');
const artistModel = require('../models/artist');
const song = require('../models/song');
const { statusS, statusF } = require("../validator/variableCommon");
let mongoose = require("mongoose");

class songsArtist {
  index(req, res, next) {
    let { id_Songs } = req.query;
    let condition = {
    }
    if (id_Songs) {
      condition = {
        ...condition, ...req.query, id_Songs: mongoose.Types.ObjectId(id_Songs)
      }
    }
    condition = {
      ...condition, ...req.query
    }
    
    songsArtistModel.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get playlistsong failed.",
          status: statusF,
          data: [],
        });
      } else {
        return res.json({
          message: "Get songs artist successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  getOne(req, res) {
    let { idSongsArtist } = req.params;
    let condition = {
      _id: mongoose.Types.ObjectId(idSongsArtist)
    }
    songsArtistModel.findById(condition).exec((err, resp) => {
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
  async create(req, res) {

    try {
      let { id_Songs: idS, id_Artist: idA } = req.body;
      let findSong = await song.find({ _id: idS })
      let findArtist = await artistModel.find({ _id: idA })
      if (findSong.length && findArtist.length) {

        let newData = {
          id_Songs: mongoose.Types.ObjectId(idS),
          id_Artist: mongoose.Types.ObjectId(idA),
        }

        let createSongsArtist = await new songsArtistModel(newData)
        createSongsArtist.save((err, data) => {
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
      } else {
        res.json({
          status: statusF,
          data: [],
          message: "Song or Artist unexist."
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
  async update(req, res) {
    try {
      let { id_Songs: idS, id_Artist: idA } = req.body;
      let findSong = await song.find({ _id: mongoose.Types.ObjectId(idS) })
      let findArtist = await artistModel.find({ _id: mongoose.Types.ObjectId(idA) })

      if (findSong.length && findArtist.length) {

        let newData = {
          id_Songs: mongoose.Types.ObjectId(idS),
          id_Artist: mongoose.Types.ObjectId(idA),
        }

        let idSongsArtist = req.params.idSongsArtist;

        const condition = {
          _id: mongoose.Types.ObjectId(idSongsArtist)
        }

        songsArtistModel.findOneAndUpdate(condition, { $set: newData }, { new: true })
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
      _id: mongoose.Types.ObjectId(req.params.idSongsArtist)
    }
    songsArtistModel.findOneAndRemove(condition)
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
module.exports = new songsArtist();
