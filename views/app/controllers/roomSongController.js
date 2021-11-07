const roomSongModel = require('../models/roomSong');
const song = require('../models/song');
const userModel = require('../models/user');
const { statusS, statusF } = require("../validator/variableCommon");
let mongoose = require("mongoose");

class roomSongController {
  index(req, res, next) {
    let { _id, _idSong, _idUser } = req.query;

    let condition = {};
    if (_id) {
      condition = {
        ...condition, ...res.query, _id: mongoose.Types.ObjectId(_id)
      }
    }
    if (_idSong) {
      condition = {
        ...condition, ...res.query, id_Song: mongoose.Types.ObjectId(_idSong)
      }
    }
    if (_idUser) {
      condition = {
        ...condition, ...res.query, id_User: mongoose.Types.ObjectId(_idUser)
      }
    }

    condition = {
      ...condition, ...res.query
    }
    
    roomSongModel.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: `We have some error:${resp}`,
          status: statusF,
          data: [],
        });
      }else if(data.length === 0){
        return res.json({
            status: statusF,
            data: data,
            message: "Không tìm thấy dữ liệu theo yêu cầu."
        })
      } else {
        return res.json({
          message: "Get room song successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  getOne(req, res) {
    let { idRoomSong } = req.params;

    let condition = {
      _id: mongoose.Types.ObjectId(idRoomSong)
    }
    roomSongModel.findById(condition).exec((err, resp) => {
      if (err || !resp) {
        return res.json({
          status: statusF,
          data: [],
          message: `We have some error:${resp}`
        })
      }else if(resp.length === 0){
          return res.json({
              status: statusF,
              data: resp,
              message: "Không tìm thấy phòng yêu cầu.",
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
      let { id_Song: idS, id_User: idU } = req.body;
      if(!idS || !idU){
          return res.json({
              status: statusF,
              data: [],
              message: "Vui lòng nhập đủ thông tin."
          })
      }
      let findSong = await song.find({ _id: mongoose.Types.ObjectId(idS) });
      let findUser = await userModel.find({ _id: mongoose.Types.ObjectId(idU) });

      if (findSong.length === 0 || findUser.length === 0) {

        let newData = {
          id_Song: mongoose.Types.ObjectId(idS),
          id_User: mongoose.Types.ObjectId(idU),
        }

        let createRoomSong = await new roomSongModel(newData)
        createRoomSong.save((err, data) => {
          if (err) {
            res.json({
              status: statusF,
              message: `We have few error: ${err}`
            })
          } else {
            res.json({
              status: statusS,
              data: [data],
              message: "Add Song to Room successfully"
            })
          }
        });
      }else{
          return res.json({
              status: statusF,
              data: [],
              message: "Bài hát hoặc Tài khoản không tồn tại, Song or User does not exist."
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
  async update(req, res) {
    try {
        let { id_Song: idS, id_User: idU } = req.body;

        if(!idS || !idU){
            return res.json({
                status: statusF,
                data: [],
                messgae: "Vui lòng nhập đủ thông tin.",
            })
        };

        let findSong = await song.find({ _id: mongoose.Types.ObjectId(idS) });
        let findUser = await userModel.find({ _id: mongoose.Types.ObjectId(idU) });

        if (findSong.length === 0 && findUser.length === 0) {
            let newData = {
            id_Song: mongoose.Types.ObjectId(idS),
            id_User: mongoose.Types.ObjectId(idU),
            }

            let idRoomSong = req.params.idRoomSong;

            const condition = {
            _id: mongoose.Types.ObjectId(idRoomSong)
            }

            roomSongModel.findOneAndUpdate(condition, { $set: newData }, { new: true })
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
        }else{
            return res.json({
                status: statusF,
                data: [],
                message: "Bài hát hoặc Tài khoản không tồn tại, Song or User does not exist."
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
  delete(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.idRoomSong)
    }
    roomSongModel.findOneAndRemove(condition)
      .exec((err) => {
        if (err) {
          res.json({
            status: statusF,
            message: `We have few error: ${err}`
          })
        } else {
          res.json({
            status: statusS,
            data: {},
            messgae: "Xóa thành công."
          })
        }
      })

  }
}
module.exports = new roomSongController();
