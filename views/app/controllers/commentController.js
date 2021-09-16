const modelComment = require("../models/comment");
const modelUser = require("../models/user");
const modelBlog = require("../models/blog");
let { statusF, statusS, localhost } = require("../validator/variableCommon");
let mongoose = require("mongoose");

class comment {
    async index(req, res) {
        const { _limit, _page } = req.query;
        let condittion = {}
        let { id_Blog, _id } = req.query;
        try {
            if (id_Blog) {
                if (id_Blog.length >= 1) {
                    condittion = { ...condittion, id_Blog: mongoose.Types.ObjectId(id_Blog) }
                }
            } else if (_id) {
                if (_id.length >= 1) {
                    condittion = { ...condittion, _id: mongoose.Types.ObjectId(_id) }
                }
            }
            let findComment = await modelComment.find(condittion).limit(_limit * 1).skip((_page - 1) * _limit);
            res.json({
                status: statusS,
                data: findComment
            })
        } catch (error) {
            res.json({
                status: statusF,
                data: []
            })
        }
    }
    async create(req, res) {
        try {
            let { id_Blog: idB, id_User: idU } = req.body;
            let findBlog = await modelBlog.find({ _id: mongoose.Types.ObjectId(idB) })
            let findUser = await modelUser.find({ _id: mongoose.Types.ObjectId(idU) })

            if (findBlog.length && findUser.length) {
                let dataComment = {
                    title: req.body.title,
                    rangeStart: req.body.rangeStart,
                    comment: req.body.comment,
                    state: req.body.state,
                    id_User: mongoose.Types.ObjectId(idU),
                    id_Blog: mongoose.Types.ObjectId(idB),
                }

                let createComment = new modelComment(dataComment)
                createComment.save((err, data) => {
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
    async edit(req, res) {
        try {
            let { id_Blog: idB, id_User: idU } = req.body;
            let findBlog = await modelBlog.find({ _id: mongoose.Types.ObjectId(idB) })
            let findUser = await modelUser.find({ _id: mongoose.Types.ObjectId(idU) })

            if (findBlog.length && findUser.length) {
                let dataComment = {
                    ...req.body,
                    id_User: mongoose.Types.ObjectId(idU),
                    id_Blog: mongoose.Types.ObjectId(idB),
                }

                let idComment = req.params.idComment;
                const condition = {
                    _id: mongoose.Types.ObjectId(idComment)
                }

                modelComment.findOneAndUpdate(condition, { $set: dataComment }, { new: true })
                    .exec((err, newComment) => {
                        if (err) {
                            res.json({
                                status: statusF,
                                message: `We have few error: ${err}`
                            })
                        } else {
                            res.json({
                                status: statusS,
                                data: [newComment],
                                message: `Update successfully`
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
            _id: mongoose.Types.ObjectId(req.params.idComment)
        }
        modelComment.findOneAndRemove(condition)
            .exec((err) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: `We have few error: ${err}`
                    })
                } else {
                    res.json({
                        status: statusF,
                        data: {}
                    })
                }
            })
    }
}
module.exports = new comment();