
const product = require("../models/products");
const user = require("../models/users");
const comment = require("../models/comment");
let mongoose = require("mongoose");
const e = require("express");


class Comment {
    async index(req, res) {
        const { _limit, _page } = req.query;
        let condittion = {}
        let { idProduct, _id } = req.query;
        try {
            if (idProduct) {
                if (idProduct.length >= 1) {
                    condittion = { ...condittion, id_Product: mongoose.Types.ObjectId(idProduct) }
                }
            } else if (_id) {
                if (_id.length >= 1) {
                    condittion = { ...condittion, _id: mongoose.Types.ObjectId(_id) }
                }
            }
            let findComments = await comment.find(condittion).limit(_limit * 1).skip((_page - 1) * _limit);
            res.json({
                status: "successfully",
                data: findComments
            })
        } catch (error) {
            res.json({
                status: "failed",
                data: []
            })
        }

    }
    async creactComment(req, res) {
        try {
            let { id_Product: idP, id_User: idU } = req.body;
            let findProduct = await product.find({ _id: mongoose.Types.ObjectId(idP) })
            let findUser = await user.find({ _id: mongoose.Types.ObjectId(idU) })
            if (findProduct.length && findUser.length) {
                let dataComment = {
                    id_Product: mongoose.Types.ObjectId(req.body.id_Product),
                    id_User: mongoose.Types.ObjectId(req.body.id_User),
                    rangeStart: req.body.rangeStart,
                    title: req.body.title,
                    comment: req.body.comment,
                    status: req.body.status
                }
                let creactComment = await new comment(req.body).save(dataComment)
                res.json({
                    status: "creact successfully",
                    data: creactComment
                })
            }

        } catch (error) {
            res.json({
                status: "failed",
                data: [],
                error: error
            })
        }
    }
    deleteOne(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.idComment)
        }
        comment.findOneAndRemove(condition)
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
    async updateComment(req, res) {
        try {

            let { id_Product: idP, id_User: idU } = req.body;
            let findProduct = await product.find({ _id: mongoose.Types.ObjectId(idP) })
            let findUser = await user.find({ _id: mongoose.Types.ObjectId(idU) })
            if (findProduct.length && findUser.length) {
                let dataComment = {
                    id_Product: mongoose.Types.ObjectId(req.body.id_Product),
                    id_User: mongoose.Types.ObjectId(req.body.id_User),
                    rangeStart: req.body.rangeStart,
                    title: req.body.title,
                    comment: req.body.comment,
                    status: req.body.status
                }
                let idComment = req.params.idComment;
                const condition = {
                    _id: mongoose.Types.ObjectId(idComment)
                }
                comment.findOneAndUpdate(condition, { $set: dataComment }, { new: true })
                    .exec((err, new_product) => {
                        if (err) {
                            res.json({
                                status: "failed",
                                message: `We have few error: ${err}`
                            })
                        } else {
                            res.json({
                                status: "successfully",
                                data: [new_product],
                                message: `You were update successfully`
                            })

                        }
                    })

            }

        } catch (error) {
            res.json({
                status: "failed",
                data: [],
                error: error
            })
        }
    }

}
module.exports = new Comment