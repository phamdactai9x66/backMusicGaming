const modelRoom = require("../models/room");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const { statusF, statusS, localhost, extensionImage } = require("../validator/variableCommon");
const { encode_jwt, decode_jwt } = require("../validator/methodCommon");
let formidable = require("formidable")

class room {
    async index(req, res, next) {
        let { _page, _limit, name_Room, _id } = req.query;
        modelRoom.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, data) => {
                if (err || !data) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
                    })
                } else {
                    if (name_Room) {
                        let findName = data.filter(currenT => {
                            let nameRoom = currenT.name.toLocaleLowerCase();
                            let ParamsName = name_Room.toLocaleLowerCase();

                            return nameRoom.indexOf(ParamsName) != -1;
                        })
                        return res.json({
                            status: statusS,
                            data: findName,
                            message: "get data successfully"
                        })
                    } else if (_id) {
                        let findId = data.find(currenT => currenT._id == _id);
                        return res.json({
                            status: statusS,
                            data: findId ? findId : {},
                            message: "get data successfully"
                        })
                    }
                    return res.json({
                        status: statusS,
                        data: data,
                        message: ``
                    })
                }
            })
    }
    getOne(req, res){
        let { idRoom } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idRoom)
        }
        modelRoom.findById(condition).exec((error, response) => {
            if (error || !response) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `We have some error: ${error}`
                })
            } else {
                res.json({
                    status: statusS,
                    data: [response],
                    message: ``
                })
            }
        })
    }
    async createRoom(req, res){
        let { name_Room, password, limit_User } = req.body;

        const getRooms = await modelRoom.find();

        if(name_Room && password && limit_User){
            const findName = getRooms.find(currenUser => (currenUser.name_Room === name_Room))
            if (findName) {
                return res.json({
                    status: statusF,
                    message: 'This room been exist!'
                })
            }
            let rooma = new modelRoom(req.body);

            rooma.save((err, data) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: err
                    })
                } else {
                    res.json({
                        status: statusS,
                        data: data,
                        message: "Create Room successfully"
                    })

                }
            })
        } else {
            return res.json({
                status: statusF,
                data: [],
                message: "We don't allow input is blank !"
            })
        }
    }
    enterRoom(){

    }
    editRoom(req, res){

    }
    deleteRoom(req, res){
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idRoom)
        }
        modelRoom.findOneAndRemove(condition)
            .exec((err) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: `We have few error: ${err}`
                    })
                } else {
                    res.json({
                        status: statusS,
                        data: [],
                        message: "delete successfully"
                    })
                }
            })
    }
}
module.exports = new room;
