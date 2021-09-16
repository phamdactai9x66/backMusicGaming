const modelSongPlaylist = require('../models/songPlaylist')
const { statusS, statusF } = require("../validator/variableCommon");
let mongoose = require("mongoose");
let formidable = require("formidable")

class songPlaylist {
  index(req, res, next) {
    let { id_Song, id_User_Playlist, _id } = req.query;
    let condition = {};

    if(_id){
      condition = {
        ...condition,
        _id: mongoose.Types.ObjectId(_id)
      }
    }
    if (id_Song) {
      condition = {
        ...condition, id_Song: mongoose.Types.ObjectId(id_Song)
      }
    }
    if(id_User_Playlist){
      condition = {
        ...condition,
        id_User_Playlist: mongoose.Types.ObjectId(id_User_Playlist)
      }
    }

    modelSongPlaylist.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get song playlist failed.",
          status: statusF,
          data: [],
        });
      } else {
        return res.json({
          message: "Get song playlist successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  getOne(req, res) {
    let { idSongPlaylist } = req.params;
    let condition = {
      _id: mongoose.Types.ObjectId(idSongPlaylist)
    };

    modelSongPlaylist.findById(condition).exec((err, data) => {
      if (err) {
        return res.json({
          status: statusF,
          data: [],
          message: `We have some error:${err}`
        });
      }else if(!data || data.length === 0){
        return res.json({
          status: statusF,
          data: [],
          message: `Song Playlist does not exist.`
        });
      } else {
        return res.json({
          status: statusS,
          data: data,
          message: "Get one song playlist successfully."
        });
      }
    })
  }
  createSongPlaylist(req, res) {
    let form = formidable.IncomingForm();
    form.parse( req, (err, fields, files) => {
      if(err || !fields){
        return res.status(400).json({
          status: statusF,
          data: [],
          message: "Create Song playlist failed. Error: " + err
        })
      }else{
        let { id_User_Playlist, id_Song } = fields;
        if(!id_User_Playlist || !id_Song){
          return res.status(400).json({
            status: statusF,
            data: [],
            message: "Create Song playlist failed. Error: " + err
          })
        }else{
          let format_form = {
            id_User_Playlist: mongoose.Types.ObjectId(id_User_Playlist), 
            id_Song: mongoose.Types.ObjectId(id_Song), 
          }

          let createSongPlaylist = new modelSongPlaylist(format_form);
          createSongPlaylist.save( (err, data) => {
            if(err){
              return res.status(400).json({
                status: statusF,
                data: [],
                message: "Create Song playlist failed. Error: " + err
              })
            }else{
              return res.status(200).json({
                status: statusS,
                data: data,
                message: "Create Song playlist successfully"
              })
            }
          })
        }
      }
    })
  }
  editSongPlaylist(req, res) {
    let form = formidable.IncomingForm();
    form.parse( req, (err, fields, files) => {
      if(err || !fields){
        return res.status(400).json({
          status: statusF,
          data: [],
          message: "Update Song playlist failed. Error: " + err
        })
      }else{
        const condition = {
          _id: mongoose.Types.ObjectId(req.params.idSongPlaylist)
        }
        const { id_User_Playlist, id_Song } = fields;

        if( !id_Song || !id_User_Playlist){
          return res.status(400).json({
            status: statusF,
            data: [],
            message: "Please input full information to update."
          })
        }

        let format_form = {
          id_User_Playlist: mongoose.Types.ObjectId(id_User_Playlist),
          id_Song: mongoose.Types.ObjectId(id_Song)
        }

        modelSongPlaylist.findOneAndUpdate( condition, { $set: format_form }, { new: true })
          .exec((err, new_data) => {
            if (err) {
              return res.status(400).json({
                status: statusF,
                message: `We have few error: ${err}`,
                data: []
              })
            } else {
              return res.status(400).json({
                status: statusS,
                data: [new_data],
                message: `Update successfully.`
              })
            }
          })
      }
    })
  }
  remove(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.idSongPlaylist)
    }
    modelSongPlaylist.findOneAndRemove(condition)
      .exec((err) => {
        if (err) {
          return res.status(400).json({
            status: statusF,
            message: `We have few error: ${err}`
          })
        } else {
          return res.status(200).json({
            status: statusS,
            data: [],
            message: "Delete song playlist successfully."
          })
        }
      })

  }
}
module.exports = new songPlaylist();
