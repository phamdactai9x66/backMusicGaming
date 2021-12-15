const topic = require("../models/topic");
const mongoose = require("mongoose")
let { statusF, statusS, localhost, extensionAudio, extensionImage } = require("../validator/variableCommon");
const formidable = require('formidable');
const path = require('path')



class topics {
    async index(req, res, next) {
        let { _page, _limit, name, id } = req.query;
        await topic.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, response) => {
                if (err || !response) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We have some error :${err}`
                    })
                } else {
                    if (name) {
                        let findName = response.filter(currenT => {
                            let nameTopic = currenT.name.toLocaleLowerCase();
                            let ParamsName = name.toLocaleLowerCase();

                            return nameTopic.indexOf(ParamsName) != -1;
                        })
                        return res.json({
                            status: statusS,
                            data: findName,
                            message: "get data successfully"
                        })
                    } else if (id) {
                        let findId = response.find(currenT => currenT._id == id);
                        return res.json({
                            status: statusS,
                            data: findId,
                            message: "get data successfully"
                        })
                    }
                    res.json({
                        status: statusS,
                        data: response,
                        message: "get data successfully"
                    })
                }
            });
    }
    async getOne(req, res) {
        let { idTopic } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idTopic)
        }
        await topic.findById(condition).exec((error, response) => {
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

    addNewTopic(req, res) {
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.json({
                    message: "Error 400. Add New Topic",
                    data: [],
                    status: statusF
                })
            }

            // check name topic = ''
            if (fields.name === '') {
                return res.json({
                    message: "Name is required.",
                    data: [],
                    status: statusF
                })
            }

            let condition = {
                // name: new RegExp(`${fields.name}`, 'i')
                name: fields.name
            }

            topic.findOne(condition).exec((err, topicExisted) => {
                if (err) {
                    return res.json({
                        message: "Error: " + err
                    })
                }

                if (topicExisted) {
                    return res.json({
                        message: `this topic been exist in database`,
                        data: [],
                        status: statusF
                    })
                }

                const uploadFile = files['image'];
                const indexOfPath = uploadFile.path.indexOf('upload')
                const cutPath = uploadFile.path.slice(indexOfPath);
                console.log(uploadFile)

                const checkImage = cutPath.split('.')[1];
                if (!checkImage) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We don't allow file is blank !`
                    })
                }
                if (!extensionImage.includes(checkImage)) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }

                const data = {
                    ...fields,
                    image: `http://localhost:5000/${cutPath}`
                }
                let createTopic = new topic(data);
                createTopic.save((err, data) => {
                    if (err) {
                        return res.json({
                            message: err,
                            data: [],
                            status: statusF
                        })
                    }
                    res.json({
                        data: data,
                        message: 'add new topic is successfully',
                        status: statusS
                    })
                })

            })
        })
    }
    updateTopic(req, res) {
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.json({
                    message: "Error 400. Add New Topic failed.",
                    status: statusF,
                    data: [],
                });
            }

            if (fields.name === "") {
                return res.json({
                    message: "Name is required.",
                    status: statusF,
                    data: [],
                });
            }

            let condition = {
                _id: mongoose.Types.ObjectId(req.params.idTopic),
            };

            const uploadFile = files["image"];
            const indexOfPath = uploadFile.path.indexOf("uploads");
            const cutPath = uploadFile.path.slice(indexOfPath);

            const checkImage = cutPath.split(".")[1];
            let format_form = {
                ...fields
            };
            if (checkImage) {
                if (extensionImage.includes(checkImage)) {
                    format_form = {
                        ...format_form, image: localhost + cutPath
                    }
                } else {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }
            topic.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                .exec((err, newData) => {
                    if (err) {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: "Update topuc failed",
                        });
                    }
                    res.json({
                        status: statusS,
                        data: newData,
                        message: "Update playlist successfully.",
                    });
                });
        });

    }
    deleteTopic(req, res) {
        const id = {
            _id: mongoose.Types.ObjectId(req.params.idTopic)
        }
        topic.findOneAndRemove(id)
            .exec((err) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: err
                    })
                } else {
                    res.json({
                        status: statusS,

                        message: "Delete topic successfully",
                    })
                }
            })
    }


}
module.exports = new topics;