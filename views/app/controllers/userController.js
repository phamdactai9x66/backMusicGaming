const modelUser = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const { statusF, statusS, localhost, extensionImage } = require("../validator/variableCommon");
const { encode_jwt } = require("../validator/methodCommon");
let formidable = require("formidable")
const { sendMailer, sendMailer2 } = require("../validator/methodCommon");
const bcrypt = require("bcrypt");
const decode_jwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}
let { cloudinary } = require('../validator/methodCommon');

class user {
    async index(req, res, next) {
        const { _limit, _page } = req.query;
        let condition = {}
        let { _id, name, role } = req.query;
        let getUsers = await modelUser.find(condition);

        try {

            if (_id) {
                condition = { ...condition, _id: mongoose.Types.ObjectId(_id) }
                if (role) {
                    condition = { ...condition, role }
                }
            } else if (role) {
                condition = { ...condition, role }
                if (_id) {
                    condition = { ...condition, _id: mongoose.Types.ObjectId(_id) }
                }
            }
            let getUser = await modelUser.find(condition).limit(_limit * 1).skip((_page - 1) * _limit);
            if (typeof name == "string") {
                // console.log(name)
                let filterUser = getUsers.filter(currenValue => {
                    let { userName } = currenValue
                    let getName = userName
                    let transformName = name.replace(/\s/img, "");

                    return role ? (getName.indexOf(transformName) != -1 && currenValue.role == role) :
                        getName.indexOf(transformName) != -1;
                })
                // console.log(filterUser)
                let transform_limit = parseInt(_limit);
                let getFirst = transform_limit * (_page - 1);//0
                let getLast = transform_limit + getFirst;

                if (_limit && _page) {
                    return res.json({
                        status: statusS,
                        data: filterUser.slice(getFirst, getLast)
                    })
                } else {
                    return res.json({
                        status: statusS,
                        data: filterUser
                    })
                }
            }
            return res.json({
                status: statusS,
                data: getUser
            })
        } catch (error) {
            res.json({
                status: statusF,
                data: []
            })
        }
    }
    getOne(req, res) {
        let { idUser } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idUser)
        }
        modelUser.findById(condition).exec((error, response) => {
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
    async signUp(req, res) {
        let form1 = res.locals.image_user;
        let { first_name, last_name, email, userName, passWord, confirmPassWord } = req.body;

        const getUsers = await modelUser.find();
        if (first_name && last_name && email && userName && passWord && confirmPassWord) {
            let find_index_path = form1.path.indexOf("uploads");
            let cut_path = form1.path.slice(find_index_path);
            // const uploadFile = files['image'];

            let getExtension = cut_path.split(".")[1];
            const findUSer = getUsers.find(currenUser => (currenUser.userName === userName))
            console.log(findUSer);
            if (findUSer) {
                return res.json({
                    status: statusF,
                    message: 'this user been exist!'
                })
            }
            const findEmail = getUsers.find(currenUser => (currenUser.email === email))
            if (findEmail) {
                return res.json({
                    status: statusF,
                    message: 'this email been exist!'
                })
            }
            if (getExtension) {
                if (!extensionImage.includes(getExtension.toLowerCase())) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }

            const getUrl = await cloudinary.uploader.upload(form1.path);
            console.log(getUrl.url)
            req.body.avatar = getUrl.url;

            delete req.body.confirmPassWord;

            let create_user = new modelUser({ ...req.body })

            create_user.save(async (err, user_Data) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: err
                    })
                } else {
                    // console.log(user_Data)
                    user_Data.passWord = undefined
                    await sendMailer(user_Data)
                    res.json({
                        status: statusS,
                        data: user_Data,
                        message: "Sign up successfully! Check your email to activate your account!"
                    })

                }
            })

        } else {
            return res.json({
                status: statusF,
                data: [],
                message: "We don't allow input is blank !"
            })
        }
    }
    login(req, res) {
        let { user } = res.locals
        if (user) {
            let getId_user = encode_jwt(user._id);
            user.passWord = undefined
            setTimeout(() => {
                res.json({
                    status: statusS,
                    token: getId_user,
                    user: user
                })
            }, 1000);
        }
    }
    async checkAccount(req, res) {
        try {
            let email = req.body;
            let find_user = await modelUser.findOne(email).select({});

            if (find_user) {
                let code = (Math.random()).toString().split(".")[1].slice(0, 6);
                let create_genSalt = await bcrypt.genSalt(10);

                let hash_code = await bcrypt.hash(code, create_genSalt);
                sendMailer2(find_user);
                res.json({
                    status: statusS,
                    message: "Chúng tôi đã gửi tới email của bạn đường link để đặt lại mật khẩu!"
                })
            } else {
                res.json({
                    status: statusF,
                    message: "User not exist"
                })
            }

        } catch (error) {
            console.log(error);
            res.json({
                status: statusF,
                message: error
            })
        }
    }
    async resetPassword(req, res) {
        let { idUser, hash } = req.params;
        // console.log(req.body)
        let { passWord, confirmPassWord } = req.body;

        let decodeTokenEmail = await decode_jwt(hash, process.env.JWT_SECRET);
        const user = await modelUser.findById({ _id: mongoose.Types.ObjectId(idUser) });

        if (hash === user.hashed) {
            return res.json({
                status: statusF,
                data: [],
                message: "Đặt lại mật khẩu thất bại, token hết hạn!",
            });
        } else {
            if (idUser == decodeTokenEmail.sub) {
                if (passWord && confirmPassWord) {
                    let general_sal = await bcrypt.genSalt(10);

                    let passWordHash = await bcrypt.hash(passWord, general_sal);
                    modelUser.findOneAndUpdate({ _id: decodeTokenEmail.sub }, { passWord: passWordHash, hashed: hash }, { new: true })
                        .exec((err, newData) => {
                            if (err) {
                                return res.json({
                                    status: statusF,
                                    data: [],
                                    message: "Reset password failed",
                                });
                            }
                            newData.hashed = undefined;
                            res.json({
                                status: statusS,
                                data: newData,
                                message: "Đặt lại mật khẩu thành công.",
                            });
                        })
                } else {
                    res.json({
                        status: statusF,
                        data: [],
                        message: "Something is wrong.",
                    });
                }
            } else {
                res.json({
                    status: statusF,
                    data: [],
                    message: "Something is wrong.",
                });
            }
        }
    }
    deleteOne(req, res) {
        const id = {
            _id: mongoose.Types.ObjectId(req.params.idUser)
        }
        modelUser.findOneAndRemove(id)
            .exec((err) => {
                if (err) {
                    res.json({
                        status: statusF,
                        message: err
                    })
                } else {
                    res.json({
                        status: statusS,
                        message: "Delete User successfully",
                    })
                }
            })
    }
    editUser(req, res) {
        let form = formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;

        form.parse(req, async (err, fields, files) => {
            let { first_name, last_name, email } = fields;

            if (first_name && last_name && email) {
                let get_id = req.params.idUser;
                const condition = {
                    _id: mongoose.Types.ObjectId(get_id)
                }
                const upload_files = files["image"];

                let find_index_path = upload_files.path.indexOf("uploads");
                let cut_path = upload_files.path.slice(find_index_path);
                let getExtension = cut_path.split(".")[1];

                let format_form = { ...fields }
                if (getExtension) {
                    if (extensionImage.includes(getExtension)) {
                        const getUrl = await cloudinary.uploader.upload(upload_files.path);
                        format_form = {
                            ...format_form, avatar: getUrl.url
                        }
                    } else {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: `We just allow image extension jpg, jpeg, bmp,gif, png`
                        })
                    }
                }

                modelUser.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                    .exec((err, new_user) => {
                        if (err) {
                            res.json({
                                status: statusF,
                                data: [],
                                message: `We have few error: ${err}`
                            })
                        } else {
                            res.json({
                                status: statusS,
                                data: [new_user],
                                message: `You was update successfully`
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
    loginGlobal(req, res) {
        if (res.locals.payLoad._id) {
            res.json({
                status: statusS,
                user: res.locals.payLoad,
                token: encode_jwt(res.locals.payLoad._id)
            })
        } else {
            res.json({
                status: statusF,
                user: "",
                token: ""
            })
        }
    }
    async verifyUser(req, res) {

        try {
            let { idUser, hash } = req.params;
            let decodeTokenEmail = await decode_jwt(hash);
            if (idUser == decodeTokenEmail?.sub) {
                modelUser.findOneAndUpdate({ _id: idUser }, { active: true }, { new: true })
                    .exec((err, newData) => {
                        if (err) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: "Active user failed",
                            });
                        }
                        return res.json({
                            status: statusS,
                            data: newData,
                            message: "Active user successfully.",
                        });
                    })
            } else {
                res.json({
                    status: statusF,
                    data: [],
                    message: "Something is wrong.",
                });
            }
        } catch (err) {
            console.log(err)
            res.json({
                status: statusF,
                data: [],
                message: "Something is wrong.",
            });
        }
    }
}
module.exports = new user;