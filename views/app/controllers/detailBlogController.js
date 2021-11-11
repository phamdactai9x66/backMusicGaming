const modelDetailBlog = require("../models/detailBlog");
const modelBlog = require("../models/blog");
let { statusF, statusS, localhost, extensionImage } = require("../validator/variableCommon");
let mongoose = require("mongoose");
const formidable = require("formidable");
let path = require("path");

class detailBlog {
    async index(req, res) {
        const { _limit, _page } = req.query;
        let condittion = {}
        let { id_Blog, _id } = req.query;
        try {
            if (id_Blog) {
                if (id_Blog.length >= 1) {
                    condittion = { ...condittion, id_Blog }
                }
            } else if (_id) {
                if (_id.length >= 1) {
                    condittion = { ...condittion, _id: mongoose.Types.ObjectId(_id) }
                }
            }
            let findDetailBlog = await modelDetailBlog.find(condittion).limit(_limit * 1).skip((_page - 1) * _limit);
            res.json({
                status: statusS,
                data: findDetailBlog
            })
        } catch (error) {
            res.json({
                status: statusF,
                data: []
            })
        }
    }
    getOne(req, res) {
        let { idDetailBlog } = req.params;
        let condition = {
            _id: mongoess.Types.ObjectId(idDetailBlog)
        }
        modelDetailBlog.findById(condition)
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
                        message: `Get Success`
                    })
                }
            })
    }
    create(req, res) {
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;

        form.parse(req, async (err, fields, files) => {
            let { id_Blog: idB, title, content } = fields;
            let findBlog = await modelBlog.find({ _id: mongoose.Types.ObjectId(idB) })

            if (findBlog.length && content && title && files["image"]) {
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
                        message: `We just allow file extension jpg, jpeg, bmp,gif, png`
                    })
                }
                let formatForm = {
                    ...fields,
                    image: localhost + cut_path,
                }
                let createDetailBlog = new modelDetailBlog(formatForm);
                createDetailBlog.save((err, product1) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: product1,
                            message: "Add Artist Successfully"
                        })
                    }
                })
            }
            else {
                res.json({
                    status: statusF,
                    data: [],
                    message: "We don't allow input is blank !"
                })
            }
        });
    }
    edit(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {

            const upload_files = files["image"];
            let get_id = req.params.idDetailBlog;

            const condition = {
                _id: mongoess.Types.ObjectId(get_id)
            }
            var format_form = {
                ...fields
            }

            let find_index_path = upload_files.path.indexOf("upload");
            let cut_path = upload_files.path.slice(find_index_path);
            let getExtension = cut_path.split(".")[1];

            if (getExtension) {
                if (extensionImage.includes(getExtension)) {
                    format_form = {
                        ...format_form, image: localhost + cut_path
                    }
                } else {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }
            modelDetailBlog.findOneAndUpdate(condition, { $set: format_form }, { new: true })
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
    delete(req, res) {
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idDetailBlog)
        }
        modelDetailBlog.findOneAndRemove(condition)
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
                        message: "Delete successfully"
                    })
                }
            })
    }
}
module.exports = new detailBlog();