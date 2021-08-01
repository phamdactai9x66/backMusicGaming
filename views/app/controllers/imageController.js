
const product = require("../models/products");
let path = require("path");
const images = require("../models/images");
let mongoose = require("mongoose");
let formidable = require("formidable")
const e = require("express");


class Comment {
    async index(req, res) {

        let { idProduct } = req.query;
        let condittion = {};
        if (idProduct) {
            condittion = {
                ...condittion,
                idProduct: mongoose.Types.ObjectId(idProduct)
            }
        }
        let listImage = await images.find({ ...condittion })
        res.json({
            status: "successfully",
            data: listImage
        })
    }
    delete(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.id_product)
        }
        images.findOneAndRemove(condition)
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
    updateImage(req, res) {
        let form1 = new formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = false;
        form1.parse(req, async (err, input_all, files) => {
            let findProduct = await product.find({ _id: mongoose.Types.ObjectId(input_all.idProduct) })
            if (findProduct.length < 1) {
                return res.json({
                    status: "failed",
                    message: "Product not exist"
                })
            };
            if (input_all.title && input_all.idProduct) {
                const upload_files = files["image"];
                var save_extention_file = ["image/jpg", "image/gif", "image/png", "image/jpeg"];
                var get_extention = upload_files.type;
                let format_form = {
                    title: input_all.title,
                    idProduct: mongoose.Types.ObjectId(input_all.idProduct)
                }
                if (save_extention_file.includes(get_extention)) {
                    let find_index_path = upload_files.path.indexOf("upload");
                    let cut_path = upload_files.path.slice(find_index_path);
                    format_form = {
                        ...format_form, url: cut_path
                    }
                }
                let get_id = req.params.id_product;
                const condition = {
                    _id: mongoose.Types.ObjectId(get_id)
                }
                images.findOneAndUpdate(condition, { $set: format_form }, { new: true })
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
                                message: `update successfully`
                            })

                        }
                    })
            } else {
                res.json({
                    status: "failed",
                    message: "can't for input empty"
                })
            }
        })
    }
    createImage(req, res) {

        let form1 = new formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = false;
        form1.parse(req, async (err, input_all, files) => {
            let findProduct = await product.find({ _id: mongoose.Types.ObjectId(input_all.idProduct) })
            if (findProduct.length < 1) {
                return res.json({
                    status: "failed",
                    message: "Product not exist"
                })
            };
            if (input_all.title && input_all.idProduct) {
                const upload_files = files["image"];
                let find_index_path = upload_files.path.indexOf("upload");
                let cut_path = upload_files.path.slice(find_index_path);

                let format_form = {
                    title: input_all.title,
                    url: cut_path,
                    idProduct: mongoose.Types.ObjectId(input_all.idProduct)
                }
                let create_images = new images(format_form);
                create_images.save((err, product1) => {
                    if (err) {
                        res.json({
                            status: "failed",
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: "successfully",
                            data: product1,
                        })
                    }
                })
            } else {
                res.json({
                    status: "failed",
                    message: "can't for input empty"
                })
            }




        })

    }


}
module.exports = new Comment