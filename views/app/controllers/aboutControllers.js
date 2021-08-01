const category = require("../models/category");
const product = require("../models/products");
let mongoose = require("mongoose");
const e = require("express");
let formidable = require("formidable");



class abouts {

    //get /about
    index(req, res, next) {
        res.render("create_category", {
            cookie_user: req.cookies.token
        })
    }
    finOneCate(req, res) {
        let condition = {
            _id: mongoose.Types.ObjectId(req.params.idCate)
        }
        category.findOne(condition).exec((err, cate1) => {
            if (err) {
                res.json({
                    status: "failed",
                    message_err: `You have few error: ${cate1}`
                })
            } else {
                res.json({
                    status: "successfully",
                    data: cate1,
                })
            }
        })

    }
    index_create_cate(req, res, next) {

        let form1 = new formidable.IncomingForm();

        form1.parse(req, (error, input_all, file) => {

            console.log(input_all)
            let condition = {
                name: new RegExp(`${input_all.name}`, "i")//%sad%
            }
            category.find(condition)
                .limit(100).sort({ _id: 1 })
                .select({})
                .exec((err, cate) => {
                    if (err) {
                        res.json({
                            status: "failed",
                            message: `You have few error: ${err}`
                        })
                    } else {
                        if (cate.length != 0) {
                            res.json({
                                status: "failed",
                                message: `name been exist in collection product`
                            })
                        } else {
                            if (input_all.name) {
                                let column_cate = {
                                    name: input_all.name
                                }
                                let cate = new category(column_cate);

                                cate.save((err, cate) => {
                                    if (err) {
                                        res.json({
                                            status: "failed",
                                            message: `You have few error: ${err}`
                                        })
                                    } else {
                                        res.json({
                                            status: "successfully",
                                            data: cate,
                                            message: "You were add new category successfully."
                                        })
                                    }
                                })
                            } else {
                                res.json({
                                    status: "failed",
                                    message: `Can't for input empty`,
                                    data: `${input_all.name}`
                                })
                            }

                        }
                    }
                })
        })



    }
    page_create_cate(req, res, next) {
        res.render("pageCreateCate", {
            cookie_user: req.cookies.token
        })
    }

    detail_cate(req, res) {
        // let get_id=mongoose.Types.ObjectId(req.params.id_cate);
        category.findById(mongoose.Types.ObjectId(req.params.id_cate))
            .exec((err, cate) => {
                if (err) {
                    res.json({
                        status: "failed",
                        message: `You have few error: ${err}`
                    })
                } else {
                    if (cate) {
                        res.json({
                            status: "successfully",
                            data: cate,
                            message: `have product in database`
                        })
                    } else {
                        res.json({
                            status: "successfully",
                            message: `have product in database`
                        })
                    }
                }

            })

    }
    edit_cate(req, res) {

        let form1 = new formidable.IncomingForm();

        form1.parse(req, (error, input_all, file) => {


            if (input_all.name) {
                let condition = {
                    _id: mongoose.Types.ObjectId(req.params.id_cate)
                }
                let form_data = {
                    name: input_all.name
                }

                category.findOneAndUpdate(condition, { $set: form_data }, { new: true },
                    (err, cate) => {
                        if (err) {
                            res.json({
                                status: "failed",
                                message: `You have few error: ${err}`
                            })
                        } else {

                            res.json({
                                status: "successfully",
                                data: cate,
                                message: "You were add update category successfully."
                            })
                        }
                    }
                )
            } else {
                res.json({
                    status: "failed",
                    message: `Can't for input empty`
                })
            }
        })
    }
    check_exist_cate(req, rest, next) {
        let get_id = req.params.id_cate;
        category.findOne(mongoose.Types.ObjectId(get_id))
            .exec((err, cate) => {
                if (err) {
                    rest.json({
                        status: "failed",
                        message: `You have few error: ${err}`
                    })
                } else {
                    if (cate) {
                        next()
                    } else {
                        rest.json({
                            status: "failed",
                            message: `Don't have any category in database`
                        })
                    }
                }
            })
    }
    delete_cate(req, res) {


        const condittion = {
            _id: mongoose.Types.ObjectId(req.params.id_cate)
        }
        category.findOneAndRemove(condittion)
            .exec((err) => {
                if (err) {
                    res.json({
                        status: "failed",
                        message: `You have few error: ${err}`
                    })
                } else {
                    res.json({
                        status: "successfully",
                        data: [],
                        message: `delete successfully`
                    })
                }
            })
    }
    next(err) {
        res.render("about", {
            message_err: err
        })
    }

}
module.exports = new abouts;