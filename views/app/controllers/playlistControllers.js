const modelPlaylist = require("../models/playlist");
let { statusF, statusS, localhost } = require("../validator/methodCommon");
let mongoess = require("mongoose");
let path = require("path");

let formidable = require("formidable")



class playlist {
    async index(req, res, next) {
        let { _page, _limit, name, _id } = req.query;
        modelPlaylist.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, response) => {
                if (err || !response) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
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
                    } else if (_id) {
                        let findId = response.find(currenT => currenT._id == _id);
                        return res.json({
                            status: statusS,
                            data: findId,
                            message: "get data successfully"
                        })
                    }
                    return res.json({
                        status: statusS,
                        data: response,
                        message: ``
                    })
                }

            })
    }
    getOne(req, res) {
        let { idPlaylist } = req.params;
        let condition = {
            _id: mongoess.Types.ObjectId(idPlaylist)
        }
        modelPlaylist.findById(condition).exec((error, response) => {
            if (error || !response) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `We have some error:${response}`
                })
            } else {
                return res.json({
                    status: statusS,
                    data: response,
                    message: ``
                })
            }
        })


    }
    createPlaylist(req, res) {

        let form1 = formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = true;
        form1.parse(req, (err, all_input, files) => {

            if (all_input.name && all_input.id_topic && files["image"]) {
                let condition = {
                    name: all_input.name.toLocaleLowerCase()
                }
                modelPlaylist.find(condition).exec((error, response) => {
                    if (error) {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: `We have some error:${error}`
                        })
                    }
                    if (response.length >= 1) {

                        return res.json({
                            status: statusF,
                            data: [],
                            message: `this playlist was have in database !`
                        })
                    } else {
                        const upload_files = files["image"];

                        let find_index_path = upload_files.path.indexOf("upload");
                        let cut_path = upload_files.path.slice(find_index_path);

                        let format_form = {
                            name: all_input.name,

                            image: localhost + cut_path,
                            id_Topic: mongoess.Types.ObjectId(all_input.id_topic)
                        }
                        let create_playList = new modelPlaylist(format_form);
                        create_playList.save((err, product1) => {
                            if (err) {
                                res.json({
                                    status: statusF,
                                    message: `We have few error: ${err}`
                                })
                            } else {
                                res.json({
                                    status: statusS,
                                    data: product1,
                                    message: "Add Product Successfully"
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
}
module.exports = new playlist;