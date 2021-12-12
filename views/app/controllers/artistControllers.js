const modelArtist = require("../models/artist");
let { statusF, statusS, localhost, extensionAudio, extensionImage } = require("../validator/variableCommon");
let mongoess = require("mongoose");
let path = require("path");

let formidable = require("formidable")


class artist {
    async index(req, res, next) {
        let { _page, _limit, name, _id } = req.query;
        modelArtist.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
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
                            let { first_Name, last_Name } = currenT
                            let nameArtist = `${first_Name} ${last_Name}`.toLocaleLowerCase();
                            let ParamsName = name.toLocaleLowerCase();

                            return nameArtist.indexOf(ParamsName) != -1;
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
        let { idArtist } = req.params;
        let condition = {
            _id: mongoess.Types.ObjectId(idArtist)
        }
        modelArtist.findById(condition)
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

    createArtist(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, (err, fields, files) => {

            let { first_Name, last_Name, gender, birth } = fields

            if (first_Name && last_Name && gender && birth && files["image"]) {
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

                let format_form = {
                    ...fields,
                    image: localhost + cut_path,
                }
                let createSlide = new modelArtist(format_form);
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
                            message: "Add Artist Successfully"
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
    editArtist(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {

            const upload_files = files["image"];
            let get_id = req.params.idArtist;
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
            modelArtist.findOneAndUpdate(condition, { $set: format_form }, { new: true })
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
    deleteArtist(req, res) {
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idArtist)
        }
        modelArtist.findOneAndRemove(condition)
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
    checkpass(req, res) {
        let condition = {
          _id: mongoose.Types.ObjectId(req.params.idArtist),
        };
        modelArtist.findOneAndUpdate(condition, {status: true}, {new:true})
        .exec((err, newData) => {
          if (err) {
            return res.json({
              status: statusF,
              data: [],
              message: "Update artist failed",
            });
          }
          res.json({
            status: statusS,
            data: newData,
            message: "Update artist successfully.",
          });
        })
      }
}
module.exports = new artist;