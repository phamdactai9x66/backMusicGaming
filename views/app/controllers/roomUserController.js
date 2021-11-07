const roomUserModel = require('../models/roomUser');
// const song = require('../models/song');
const userModel = require('../models/user');
const { statusS, statusF } = require("../validator/variableCommon");
let mongoose = require("mongoose");

class roomUserController {
  index(req, res, next) {
    let { _id, _idRoom, _idUser } = req.query;

    let condition = {};
    if (_id) {
      condition = {
        ...condition, ...res.query, _id: mongoose.Types.ObjectId(_id)
      }
    }
    if (_idRoom) {
      condition = {
        ...condition, ...res.query, id_Room: mongoose.Types.ObjectId(_idRoom)
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
    
    roomUserModel.find(condition).exec((err, data) => {
      if (err) {
        return res.json({
          message: `We have some error:${err}`,
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
          message: "Get room user successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  getOne(req, res) {
    let { idRoomUser } = req.params;

    let condition = {
      _id: mongoose.Types.ObjectId(idRoomUser)
    }
    roomUserModel.findById(condition).exec((err, resp) => {
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
      let { id_Room: idR, id_User: idU } = req.body;
      
      if(!idR || !idU){
          return res.json({
              status: statusF,
              data: [],
              message: "Vui lòng nhập đủ thông tin."
          })
      }

    //   let findRoom = await song.find({ _id: mongoose.Types.ObjectId(idR) });
      let findUser = await userModel.find({ _id: mongoose.Types.ObjectId(idU) });

    if (findUser.length !== 0) {
    // if (findRoom.length !== 0 || findUser.length !== 0) {

        let newData = {
          id_Room: mongoose.Types.ObjectId(idR),
          id_User: mongoose.Types.ObjectId(idU),
        }

        let createRoomUser = await new roomUserModel(newData)
        createRoomUser.save((err, data) => {
          if (err) {
            return res.json({
              status: statusF,
              message: `We have few error: ${err}`
            })
          } else {
            return res.json({
              status: statusS,
              data: [data],
              message: "Add User to Room successfully"
            })
          }
        });
      }else{
          return res.json({
              status: statusF,
              data: [],
              message: "Tài khoản hoặc Phòng không tồn tại, User or Room does not exist."
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
        let { id_Room: idR, id_User: idU } = req.body;

        if(!idR || !idU){
            return res.json({
                status: statusF,
                data: [],
                messgae: "Vui lòng nhập đủ thông tin.",
            })
        };

        // let findRoom = await song.find({ _id: mongoose.Types.ObjectId(idR) });
        let findUser = await userModel.find({ _id: mongoose.Types.ObjectId(idU) });

        if (findUser.length !== 0) {
        // if (findRoom.length !== 0 || findUser.length !== 0) {
            let newData = {
                id_Room: mongoose.Types.ObjectId(idR),
                id_User: mongoose.Types.ObjectId(idR),
            }

            let idRoomUser = req.params.idRoomUser;

            const condition = {
                _id: mongoose.Types.ObjectId(idRoomUser)
            }

            roomUserModel.findOneAndUpdate(condition, { $set: newData }, { new: true })
            .exec((err, new_data) => {
                if (err) {
                    return res.json({
                        status: "failed",
                        message: `We have few error: ${err}`
                    })
                } else {
                    return res.json({
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
      return res.json({
        status: statusF,
        data: [],
        error: error
      })
    }
  }
  delete(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.idRoomUser)
    }
    roomUserModel.findOneAndRemove(condition)
      .exec((err) => {
        if (err) {
          return res.json({
            status: statusF,
            message: `We have few error: ${err}`
          })
        } else {
          return res.json({
            status: statusS,
            data: {},
            message: "Xóa thành công."
          })
        }
      })

  }
}
module.exports = new roomUserController();
