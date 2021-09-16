const modelCategoryBlog = require("../models/categoryBlog");
const modelBlog = require("../models/blog");
let { statusF, statusS } = require("../validator/methodCommon");
let mongoess = require("mongoose");

let formidable = require("formidable");
const mongooseSlugGenerator = require("mongoose-slug-generator");


class categoryBlog {
    async index(req, res, next) {
        let { _page, _limit, name, _id } = req.query;
        let condition = {};
        if (_id) {
            condition = {
                ...condition,
                _id: mongoess.Types.ObjectId(_id),
            };
        }
        await modelCategoryBlog.find(condition).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, data) => {
                if (err || !data) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: "Get category blog failed. Error: " + err
                    })
                } else {
                    return res.json({
                        status: statusS,
                        data: data,
                        message: "Get category blog Successfully."
                    })
                }
            })
    }

    createCategoryBlog(req, res) {
        let form = formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: "Create category blog failed. Error: " + err
                })
            }

            if (fields.name) {
                let format_form = {
                    name: fields.name.trim(),
                }
                let createCategoryBlog = new modelCategoryBlog(format_form);
                createCategoryBlog.save((err, album) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            message: `We have few error: ${err} ==> Please input full information.`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: album,
                            message: "Create Category Blog Successfully."
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
    editCategoryBlog(req, res) {
        let form = formidable.IncomingForm();
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {
            if (err || !fields) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Update category blog failed. Error: ${err}`
                })
            }
            //trong trường hợp cố ý xóa hết các field nhập thì cần phải check lại xem ní có rỗng không
            if (!fields.name) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Do not leave the name blank.`
                })
            }

            const idCategoryBlog = req.params.idCategoryBlog;
            const condition = {
                _id: mongoess.Types.ObjectId(idCategoryBlog)
            }
            const format_form = {
                name: fields.name
            }

            modelCategoryBlog.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                .exec((err, newData) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            data: [],
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: [newData],
                            message: `Update Category Blog Successfully.`
                        })
                    }
                })
        })
    }
    deleteCategoryBlog(req, res) {
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idCategoryBlog)
        }
        modelCategoryBlog.findOneAndRemove(condition)
            .exec((err, categoryBlogDeleted) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: `We have few error: ${err}`
                    })
                } else {
                    const attr = {
                        id_CategoryBlog: mongoess.Types.ObjectId(req.params.idCategoryBlog)
                    }
                    modelBlog.find(attr).remove((err, blogDeleted) => {
                        if (err) {
                            return res.json({
                                status: statusF,
                                message: `We have few error: ${err}`
                            })
                        }
                        res.json({
                            status: statusS,
                            blogDeleted: blogDeleted,
                            data: categoryBlogDeleted,
                            message: "delete category blog successfully"
                        })
                    })
                }
            })
    }
}
module.exports = new categoryBlog;