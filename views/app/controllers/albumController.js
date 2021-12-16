const modelAlbum = require("../models/album");
let { statusF, statusS, localhost, extensionAudio, extensionImage } = require("../validator/variableCommon");
let mongoess = require("mongoose");
let path = require("path");

let formidable = require("formidable");
const { cloudinary } = require("../validator/methodCommon");


class album {
    index(req, res, next) {
        let { _page, _limit, _id, id_Artist, title } = req.query;

        var condition = {};
        if (_id) {
            condition = {
                ...condition,
                _id: mongoess.Types.ObjectId(_id)
            }
        }
        if (title) {
            condition = {
                ...condition,
                title: new RegExp(`${title}`, 'i')
            }
        }

        modelAlbum.find(condition).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, data) => {
                if (err || !data) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
                    })
                } else {
                    if (title) {
                        let findTitle = data.filter(currenT => {
                            let { title: currentTitle } = currenT;
                            let TitleArtist = currentTitle.toLocaleLowerCase();
                            let ParamsTitle = title.toLocaleLowerCase();

                            return TitleArtist.indexOf(ParamsTitle) != -1;
                        })
                        return res.json({
                            status: statusS,
                            data: findTitle,
                            message: "get data successfully"
                        })
                    }
                    else if (id_Artist) {

                        const find_idArtist = data.reduce((previousV, currenV) => ({ ...previousV, [currenV.id_Artist]: currenV }), [])
                        return res.json({
                            status: statusS,
                            data: find_idArtist[id_Artist] ? [find_idArtist[id_Artist]] : {},
                            message: "get data successfully"
                        })
                    }
                    return res.json({
                        status: statusS,
                        data: data,
                        message: "get album successfully."
                    })
                }
            })
    }
    getOne(req, res) {
        let { idAlbum } = req.params;
        let condition = {
            _id: mongoess.Types.ObjectId(idAlbum)
        }
        modelAlbum.findById(condition)
            .exec((err, album) => {
                if (err || !album) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We have some error:${err}`
                    })
                } else {
                    return res.json({
                        status: statusS,
                        data: album,
                        message: `get one album successfully.`
                    })
                }
            })
    }
    createAlbum(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: "Add Artist failed. Error: " + err
                })
            }

            let { title, id_Artist } = fields

            if (title && id_Artist && files["image"]) {
                const upload_files = files["image"];


                let find_index_path = upload_files.path.indexOf("upload");
                let cut_path = upload_files.path.slice(find_index_path);

                let getExtension = cut_path.split(".")[1]?.toLowerCase();
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

                const getUrl = await cloudinary.uploader.upload(upload_files.path);
                let format_form = {
                    title: title.trim(),
                    id_Artist: id_Artist,
                    image: getUrl.url,
                }
                let createAlbum = new modelAlbum(format_form);
                createAlbum.save((err, album) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: album,
                            message: "Add Album Successfully."
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
    editAlbum(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async (err, fields, files) => {
            if (err || !fields) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Update Album failed. Error: ${err}`
                })
            }
            //trong trường hợp cố ý xóa hết các field nhập thì cần phải check lại xem ní có rỗng không
            const { title, id_Artist } = fields;
            if (!title || !id_Artist) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `Update Album failed. Please input full information of Album.`
                })
            }

            const upload_files = files["image"];
            let id_Album = req.params.idAlbum;
            const condition = {
                _id: mongoess.Types.ObjectId(id_Album)
            }
            var format_form = {
                title: fields.title.trim(),
                id_Artist: fields.id_Artist
            }

            let find_index_path = upload_files.path.indexOf("upload");
            let cut_path = upload_files.path.slice(find_index_path);
            let getExtension = cut_path.split(".")[1]?.toLowerCase();
            
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
                        message: `We just allow image extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }
            modelAlbum.findOneAndUpdate(condition, { $set: format_form }, { new: true })
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
    deleteAlbum(req, res) {
        const condition = {
            _id: mongoess.Types.ObjectId(req.params.idAlbum)
        }
        modelAlbum.findOneAndRemove(condition)
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
module.exports = new album;