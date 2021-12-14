const modelUserPlaylist = require("../models/userPlaylist");
let { statusF, statusS } = require("../validator/variableCommon");
let mongoose = require("mongoose");

let formidable = require("formidable")


class UserPlaylist {
    index(req, res) {
        let { _page, _limit, _id, id_User } = req.query;

        var condition = {};
        if (_id) {
            condition = {
                ...condition,
                _id: mongoose.Types.ObjectId(_id)
            }
        }
        if (id_User) {
            condition = {
                ...condition,
                id_User: mongoose.Types.ObjectId(id_User)
            }
        }
        modelUserPlaylist.find(condition).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, data) => {
                if (err) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
                    })
                } else if (data.length === 0) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: "Playlist does not exist."
                    })
                } else {
                    return res.json({
                        status: statusS,
                        data: data,
                        message: "Get Playlist successfully."
                    })
                }
            })
    }
    getOne(req, res) {
        let { idUserPlaylist } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idUserPlaylist)
        }
        modelUserPlaylist.findById(condition)
            .exec((err, playlist) => {
                if (err || !playlist) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We have some error: ${err}`
                    })
                } else if (playlist.length === 0) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: "Playlist does not exist."
                    })
                } else {
                    return res.status(200).json({
                        status: statusS,
                        data: playlist,
                        message: `Get one Playlist successfully.`
                    })
                }
            })
    }
    createUserPlaylist(req, res) {
        let form = formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: "Create User Playlist failed. Error: " + err
                })
            }

            let { name, id_User } = fields

            if (name && id_User) {
                let format_form = {
                    name: name.trim(),
                    id_User: mongoose.Types.ObjectId(id_User),
                }
                let createUserPlaylist = new modelUserPlaylist(format_form);
                createUserPlaylist.save((err, userPlaylist) => {
                    if (err) {
                        return res.json({
                            status: statusF,
                            message: `We have few error: ${err}`
                        })
                    } else {
                        return res.status(200).json({
                            status: statusS,
                            data: [userPlaylist],
                            message: "Create User Playlist Successfully."
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
        })
    }
    editUserPlaylist(req, res) {
        let form = formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err || !fields) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Update Playlist failed. Error: ${err}`
                })
            }
            const { name, id_User } = fields;
            if (!name || !id_User) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Update Playlist failed. Please input full information of Playlist.`
                })
            }

            let id_UserPlaylist = req.params.idUserPlaylist;
            const condition = {
                _id: mongoose.Types.ObjectId(id_UserPlaylist)
            }
            var format_form = {
                name: name,
                id_User: id_User
            }
            modelUserPlaylist.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                .exec((err, updated) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            data: [],
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: [updated],
                            message: `Update Playlist successfully`
                        })
                    }
                })
        })
    }
    deleteUserPlaylist(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.idUserPlaylist)
        }
        modelUserPlaylist.findOneAndRemove(condition)
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
                        message: "delete playlist successfully"
                    })
                }
            })
    }
}
module.exports = new UserPlaylist;