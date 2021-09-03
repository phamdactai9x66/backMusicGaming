const modelPlaylist = require("../models/playlist");
const modelPlaylistSong = require("../models/playlistSong");
const mongoose = require("mongoose");
const formidable = require("formidable");
const path = require("path");
const { statusF, statusS, extensionImage, extensionAudio } = require("../validator/methodCommon");

class playlist {
  async index(req, res, next) {
    let { _page, _limit, name, id } = req.query;
    await modelPlaylist
      .find({})
      .limit(_limit * 1)
      .skip((_page - 1) * _limit)
      .select({})
      .exec((err, response) => {
        if (err || !response) {
          return res.json({
            status: statusF,
            data: [],
            message: err,
          });
        } else {
          if (name) {
            let findName = response.filter((item) => {
              let namePlaylist = item.name.toLocaleLowerCase();
              let ParamsName = name.toLocaleLowerCase();
              return namePlaylist.indexOf(ParamsName) != -1;
            });
            return res.json({
              status: statusS,
              data: findName,
              message: "Get data successfully",
            });
          } else if (id) {
            let findId = response.find((item) => item._id == id);
            return res.json({
              status: statusS,
              data: findId,
              message: "Get data successfully",
            });
          }
          res.json({
            status: statusS,
            data: response,
            message: "Get data successfully",
          });
        }
      });
  }

  async getOnePlaylist(req, res) {
    let { id } = req.params;
    let condition = {
      _id: mongoose.Types.ObjectId(id),
    };
    await modelPlaylist.findById(condition).exec((error, response) => {
      if (error || !response) {
        return res.json({
          status: statusF,
          data: [],
          message: `We have some error: ${error}`,
        });
      } else {
        res.json({
          status: statusS,
          data: [response],
          message: `Get a play list successfully`,
        });
      }
    });
  }

  addNewPlayList(req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../public/uploads");
    form.keepExtensions = true;
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.multiples = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Error 400. Add New Play list failed.",
          data: [],
          status: statusF,
        });
      }

      if (fields.name === "") {
        return res.json({
          message: "Name is required.",
          data: [],
          status: statusF,
        });
      }

      let condition = {
        name: fields.name,
      };

      modelPlaylist.findOne(condition).exec((err, playlistExisted) => {
        if (err) {
          return res.json({
            message: "Error: " + err,
            data: [],
            status: statusF,
          });
        }

        if (playlistExisted) {
          return res.json({
            message: `This playlist been exist in database`,
            data: [],
            status: statusF,
          });
        }

        const uploadFile = files["image"];

        const indexOfPath = uploadFile.path.indexOf("upload");
        const cutPath = uploadFile.path.slice(indexOfPath);

        const checkImage = cutPath.split(".")[1];
        if (!checkImage) {
          return res.json({
            status: statusF,
            data: [],
            message: `We don't allow file is blank !`
          })
        }
        if (!extensionImage.includes(checkImage)) {
          return res.json({
            status: statusF,
            data: [],
            message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
          })
        }

        const data = {
          ...fields,
          image: `http://localhost:5000/${cutPath}`,
        };
        let createPlaylist = new modelPlaylist(data);
        createPlaylist.save((err, data) => {
          if (err) {
            return res.json({
              message: err,
              status: statusF,
              data: [],
            });
          }
          res.json({
            data: [data],
            message: "add new playlist successfully",
            status: statusS,
          });
        });
      });
    });
  }

  removePlayList(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.id),
    };
    modelPlaylist.findOneAndRemove(condition).exec((err, deletedPlaylist) => {
      if (err) {
        return res.json({
          status: statusF,
          message: "Error: " + err,
        });
      } else {
        const attr = {
          id_Playlist: condition._id,
        };
        modelPlaylistSong
          .findOneAndRemove(attr)
          .exec((err, deletedPlaylistSong) => {
            if (err) {
              return res.json({
                status: statusF,
                message: "Error: " + err,
              });
            } else {
              return res.json({
                status: statusS,
                message: "Delete successfully",
                playlistsong: deletedPlaylistSong,
                playlist: deletedPlaylist,
              });
            }
          });
      }
    });
  }

  updatePlayList(req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../public/uploads");
    form.keepExtensions = true;
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.multiples = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Error 400. Add New Play list failed.",
          status: statusF,
          data: [],
        });
      }

      if (fields.name === "") {
        return res.json({
          message: "Name is required.",
          status: statusF,
          data: [],
        });
      }

      let condition = {
        _id: mongoose.Types.ObjectId(req.params.id),
      };

      const uploadFile = files["image"];
      const indexOfPath = uploadFile.path.indexOf("upload");
      const cutPath = uploadFile.path.slice(indexOfPath);

      const checkImage = cutPath.split(".")[1];
      let data = {};
      data = {
        ...fields,
      };

      if (checkImage) {
        if (extensionImage.includes(checkImage)) {
          data = {
            ...fields,
            image: `http://localhost:5000/${cutPath}`,
          };
        } else {
          return res.json({
            status: statusF,
            data: [],
            message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
          })

        }
      }

      modelPlaylist
        .findOneAndUpdate(condition, { $set: data }, { new: true })
        .exec((err, newData) => {
          if (err) {
            return res.json({
              status: statusF,
              data: [],
              message: "Update playlist failed",
            });
          }
          res.json({
            status: statusS,
            data: newData,
            message: "Update playlist successfully.",
          });
        });
    });
  }
}
module.exports = new playlist();
