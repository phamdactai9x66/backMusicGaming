const products = require("../models/products");
const category = require("../models/category");
let mongoose = require("mongoose");
let formidable = require("formidable");// the libary help us can mannger file image upload
let path = require("path");
const { validationResult } = require("express-validator");
const fetch = require("node-fetch");

class product {

    async index(req, res) {

        const { _page, _limit } = req.query;
        let condition = {}
        let { id_cate, minPrice, maxPrice, name } = req.query;
        if (id_cate) {
            condition = { ...condition, id_cate: id_cate }
        }

        let getProduct = await products.find(condition);


        products.find(condition).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, product) => {
                if (err) {
                    res.json({
                        status: "failed",
                        message: `We have few error: ${err}`
                    })
                } else {
                    if (minPrice >= 0 && parseInt(maxPrice) >= 1) {
                        let filterPrice = getProduct.filter(currenValue => {
                            if (name) {
                                return parseInt(minPrice) <= currenValue.price && currenValue.price <= parseInt(maxPrice)
                                    && currenValue.name.indexOf(name) != -1
                            }
                            return parseInt(minPrice) <= currenValue.price && currenValue.price <= parseInt(maxPrice)
                        })
                        let first = _limit * (_page - 1);

                        let last = (parseInt(_limit)) + first;
                        if (_limit && _page) {
                            res.json({
                                status: "successfully",
                                data: filterPrice.slice(first, last),
                            })
                        } else {
                            res.json({
                                status: "successfully",
                                data: filterPrice,
                            })
                        }
                    } else if (typeof name == "string") {
                        let savedata = [];
                        if (name) {
                            savedata = getProduct.filter((currenValue) => currenValue.name.indexOf(name) != -1)
                            let first = _limit * (_page - 1);

                            let last = (parseInt(_limit)) + first;
                            if (_limit && _page) {
                                return res.json({
                                    status: "successfully",
                                    data: savedata.slice(first, last),
                                })
                            } else {
                                savedata = [...savedata]
                            }
                        } else {
                            savedata = [...product]
                        }
                        res.json({
                            status: "successfully",
                            data: [...savedata],
                        })
                    }
                    else {
                        res.json({
                            status: "successfully",
                            data: product,
                        })
                    }

                }
            })
    }
    pageAddProduct(req, res, next) {
        category.find({}).limit(100).sort({ _id: 1 }).select({})
            .exec((err, cate) => {
                if (err) {
                    res.json({
                        status: "error",
                        messgae: err
                    })
                } else {
                    res.render("pageCreateProduct", {
                        status: "successfully",
                        data_cate: cate,
                        cookie_user: req.cookies.token
                    })
                }
            })

    }
    detail_product(req, res) {
        let get_id = req.params.id_product;
        const detail = {
            _id: mongoose.Types.ObjectId(get_id)
        }
        products.findOne(detail).exec((err, find_product) => {
            if (err) {
                res.json({
                    status: "failed",
                    message: `We have few error: ${err}`
                })
            } else {
                res.json({
                    status: "successfully",
                    data: find_product
                })
            }
        })
    }
    check_exist_product(req, res, next) {
        let get_id = req.params.id_product;
        const detail = {
            _id: mongoose.Types.ObjectId(get_id)
        }
        products.findOne(detail).exec((err, find_product) => {
            if (err || !find_product) {
                res.json({
                    status: "failed",
                    message: `We have few error: ${err}`
                })
            }
            next()
        })
    }
    delete_product(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.id_product)
        }
        products.findOneAndRemove(condition)
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
    create_product(req, res) {

        let form1 = new formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = true;
        form1.parse(req, (err, input_all, files) => {

            let condition = {
                name: new RegExp(`${input_all.name}`, "i")
            }
            products.findOne(condition).exec((err, cate) => {
                if (err) {
                    res.json({
                        status: "failed",
                        message: `We have few error: ${err}`
                    })
                } else {
                    if (cate) {
                        res.json({
                            status: "failed",
                            message: `product Was in database`
                        })
                    } else {
                        if (input_all.name &&
                            input_all.quantity && input_all.price && input_all.id_cate) {
                            const upload_files = files["image"];

                            let find_index_path = upload_files.path.indexOf("upload");
                            let cut_path = upload_files.path.slice(find_index_path);

                            let format_form = {
                                name: input_all.name,
                                quantity: input_all.quantity,
                                price: input_all.price,
                                image: {
                                    extention: upload_files.type,
                                    name_file: cut_path
                                },
                                status: input_all.status
                                ,
                                describe: input_all.describe,
                                id_cate: mongoose.Types.ObjectId(input_all.id_cate)
                            }
                            let create_product = new products(format_form);
                            create_product.save((err, product1) => {
                                if (err) {
                                    res.json({
                                        status: "failed",
                                        message: `We have few error: ${err}`
                                    })
                                } else {
                                    res.json({
                                        status: "successfully",
                                        data: product1,
                                        message: "Add Product Successfully"
                                    })

                                }
                            })
                        } else {
                            res.json({
                                status: "failed",
                                message: "can't for input empty"
                            })
                        }

                    }
                }
            })


        })

    }
    update_product(req, res) {
        let form1 = new formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = true;
        var save_extention_file = ["image/jpg", "image/gif", "image/png", "image/jpeg"];
        form1.parse(req, async (err, input_all, files) => {

            const upload_files = files["image"];
            let get_id = req.params.id_product;
            var get_extention = upload_files.type;

            const condition = {
                _id: mongoose.Types.ObjectId(get_id)
            }
            var format_form = {
                name: input_all.name,
                quantity: input_all.quantity,
                price: input_all.price,
                describe: input_all.describe,
                status: input_all.status,
                id_cate: mongoose.Types.ObjectId(input_all.id_cate)
            }
            if (save_extention_file.includes(get_extention)) {
                let find_index_path = upload_files.path.indexOf("upload");
                let cut_path = upload_files.path.slice(find_index_path);
                format_form = {
                    ...format_form, image: {
                        extention: upload_files.type,
                        name_file: cut_path
                    }
                }
            }
            products.findOneAndUpdate(condition, { $set: format_form }, { new: true })
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
        })

    }
    page_update_product(req, res) {

        const condition = {
            _id: mongoose.Types.ObjectId(req.params.id_product)
        }
        products.findOne(condition).select({})
            .exec(async (err, find_product) => {
                if (err || !find_product) {
                    res.json({
                        status: "error",
                        message: err
                    })
                } else {
                    let get_cate = await category.find().limit(100);
                    res.render("pageUpdateProduct", {
                        status: "successfully",
                        data_product: find_product,
                        data_cate: [...get_cate],
                        cookie_user: req.cookies.token
                    })
                }
            })

    }
    async test123(req, res) {
        let api_url = await fetch("http://localhost:5000/product");
        let fetch_response = await api_url.json();
        res.json({
            status: "ahihi",
            data: fetch_response
        })
    }
}
module.exports = new product;