const slides = require("../models/slides");
let { statusF, statusS, localhost, extensionAudio, extensionImage } = require("../validator/variableCommon");
let mongoess = require("mongoose");
let path = require("path");

let formidable = require("formidable");
const { cloudinary } = require("../validator/methodCommon");

class slide {
    index(req, res, next) {
        let { _page, _limit, name, _id } = req.query;
        slides.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, data) => {
                if (err || !data) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
                    })
                } else {
                    if (name) {
                        let findName = data.filter(currenT => {
                            let nameSlide = currenT.name.toLocaleLowerCase();
                            let ParamsName = name.toLocaleLowerCase();

                            return nameSlide.indexOf(ParamsName) != -1;
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
    getOne(req, res) {
        let { idSlide } = req.params;
        let condition = {
            _id: mongoess.Types.ObjectId(idSlide)
        }
        slides.findById(condition)
            .exec((err, resp) => {
                if (err || !resp) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We have some error:${resp}`
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
    createSlide(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, (err, fields, files) => {
            if (fields.name && fields.content && files["image"] && fields.id_Songs) {
                let condition = {
                    name: fields.name
                }
                slides.find(condition).exec( async (err, response) => {
                    if (err) {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: `We have some error:${err}`
                        })
                    }
                    if (response.length >= 1) {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: `this slide is already in the database !`
                        })
                    } else {
                        const upload_files = files["image"];

                        let find_index_path = upload_files.path.indexOf("upload");
                        let cut_path = upload_files.path.slice(find_index_path);

                        let getExtension = cut_path.split(".")[1];
                        if (!getExtension) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: `We don't allow file is blank !`
                            })
                        }
                        if (!extensionImage.includes(getExtension)) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                            })
                        }

                        const getUrl = await cloudinary.uploader.upload(upload_files.path);
                        let format_form = {
                            name: fields.name,
                            image: getUrl.url,
                            content: fields.content,
                            id_Songs: mongoess.Types.ObjectId(fields.id_Songs)
                        }
                        let createSlide = new slides(format_form);
                        createSlide.save((err, product1) => {
                            if (err) {
                                res.json({
                                    status: statusF,
                                    message: `We have few error: ${err}`
                                })
                            } else {
                                res.json({
                                    status: statusS,
                                    data: product1,
                                    message: "Add Slide Successfully"
                                })
                            }
                        })
                    }
                })
            } else {
                res.json({
                    status: statusF,
                    data: [],
                    message: "We don't allow input is blank !"
                })
            }
        })
    }
    editSlide(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {

            const upload_files = files["image"];
            let get_id = req.params.idSlide;


            const condition = {
                _id: mongoess.Types.ObjectId(get_id)
            }
            var format_form = {
                ...fields,
                id_Songs: mongoess.Types.ObjectId(fields.id_Songs)
            }

            let find_index_path = upload_files.path.indexOf("upload");
            let cut_path = upload_files.path.slice(find_index_path);
            let getExtension = cut_path.split(".")[1];

            if (getExtension) {
                if (extensionImage.includes(getExtension)) {
                    const getUrl = await cloudinary.uploader.upload(upload_files.path);
                    format_form = {
                        ...format_form, image: getUrl.url
                    }
                } else {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }
            slides.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                .exec((err, new_product) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            data: [],
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: [new_product],
                            message: `You were update successfully`
                        })
                    }
                })
        })
    }
    deleteSlide(req, res) {
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idSlide)
        }
        slides.findOneAndRemove(condition)
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
module.exports = new slide;