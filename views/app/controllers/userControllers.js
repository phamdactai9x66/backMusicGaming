const users = require("../models/users.js")
const formidable = require("formidable");
const { create } = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { date } = require("@hapi/joi");

const path = require("path");
const bcrypt = require("bcrypt");
const { sendMeailer, check_pass, host } = require("../validator/method_common");

const { JWT_SECRET } = require("../../config/variable_global");
const mongoose = require("mongoose");
const console = require("console");
// const { delete } = require("../../routes/user.js");

const encode_jwt = (idUser) => {
    return jwt.sign({
        iss: "Pham dac tai",
        sub: idUser,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 5)
    }, JWT_SECRET)
}
const deCode_jwt = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

class page_user {
    async index(req, res) {

        const { _limit, _page } = req.query;
        let condition = {}
        let { _id, name, role } = req.query;
        let getUsers = await users.find(condition);

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
            let getUser = await users.find(condition).limit(_limit * 1).skip((_page - 1) * _limit);

            if (typeof name == "string") {
                // console.log(name)
                let filterUser = getUsers.filter(currenValue => {
                    let { first_name, last_name } = currenValue
                    let getName = `${first_name} ${last_name}`.replace(/\s/img, "");
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
                        status: "successfully",
                        data: filterUser.slice(getFirst, getLast)
                    })
                } else {
                    return res.json({
                        status: "successfully",
                        data: filterUser
                    })
                }
            }
            return res.json({
                status: "successfully",
                data: getUser
            })
        } catch (error) {
            res.json({
                status: "failed",
                data: []
            })
        }
    }
    deleteUser(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.idUser)
        }
        users.findOneAndRemove(condition)
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
    async getOneUser(req, res) {
        let { idUser } = req.params;
        try {
            let condition = {}
            if (idUser) {
                condition = { ...condition, _id: mongoose.Types.ObjectId(idUser) }
            }
            let getUser = await users.findOne(condition);
            res.json({
                status: "successfully",
                data: getUser
            })
        } catch (error) {
            res.json({
                status: "failed",
                data: [],
                error: error
            })
        }
    }
    sign_in(req, res) {
        let { user } = res.locals;
        if (user) {
            let getId_user = encode_jwt(user._id);
            res.json({
                status: "successfully",
                token: getId_user,
                user: user
            })
        }

    }
    signOut(req, res) {
        res.clearCookie('token')

        res.redirect("/user/sign_in")
    }
    async updateProfile(req, res) {
        let request_form = req.body;

        let image = res.locals.image_user;

        let user1 = res.locals.users;

        delete request_form.image;

        var save_extention_file = ["image/jpg", "image/gif", "image/png", "image/jpeg"];
        // console.log(image)
        if (image) {
            if (save_extention_file.includes(image.type)) {
                let find_index_path = image.path.indexOf("imageUser");
                let cut_path = image.path.slice(find_index_path);
                request_form.avatar = `${host}/${cut_path}`;

            }
        }
        // users
        let update_user = await users.findByIdAndUpdate(user1._id, { $set: request_form }, { new: true }).select({});
        console.log(update_user)
        res.json({
            status: "successfully",
            data: update_user,
            message: "update successfully",
            token: encode_jwt(update_user._id)
        })
    }
    async updateUser(req, res) {
        let request_form = req.body;

        let image = res.locals.image_user;

        let user1 = req.params.idUser;

        delete request_form.image;

        var save_extention_file = ["image/jpg", "image/gif", "image/png", "image/jpeg"];
        // console.log(image)
        if (image) {
            if (save_extention_file.includes(image.type)) {
                let find_index_path = image.path.indexOf("imageUser");
                let cut_path = image.path.slice(find_index_path);
                request_form.avatar = `${host}/${cut_path}`;

            }
        }
        if (request_form.confirmPassWord) {
            let general_sal = await bcrypt.genSalt(10);

            let passWordHash = await bcrypt.hash(request_form.passWord, general_sal);
            request_form.passWord = passWordHash;
            console.log("xin caho")
        }

        // users
        let update_user = await users.findByIdAndUpdate(user1, { $set: request_form }, { new: true }).select({});
        // console.log(update_user)
        res.json({
            status: "successfully",
            data: update_user,
            message: "update successfully",
            token: encode_jwt(update_user._id)
        })

    }
    async pageProfile(req, res) {

        try {
            let get_user = deCode_jwt(req.params.tokenUser)

            const condition = {
                _id: mongoose.Types.ObjectId(get_user.sub)
            }
            let find_user = await users.findOne(condition).select({});

            res.render("profile", {
                cookie_user: req.cookies.token,
                data_user: find_user
            })
        } catch (error) {
            res.json({
                status: "error",
                message: error
            })
        }
    }
    sign_up(req, res) {

        let form1 = res.locals.image_user;
        var save_extention_file = ["image/jpg", "image/gif", "image/png", "image/jpeg"];
        if (form1) {
            if (save_extention_file.includes(form1.type)) {
                let find_index_path = form1.path.indexOf("imageUser");
                let cut_path = form1.path.slice(find_index_path);
                req.body.avatar = `${host}/${cut_path}`;
            }
        }

        delete req.body.confirmPassWord;
        let create_user = new users({ ...req.body })

        create_user.save((err, user_Data) => {
            if (err) {
                res.status(200).json({
                    status: "failed",
                    message: "We guess several fields been have in DB,Example:Email,userName...."
                })
            } else {
                res.json({
                    status: "successfully",
                    data: user_Data,
                    message: "sign up successfully"
                })

            }
        })
    }

    page_checkAccount(req, res) {
        res.render("checkAccount")
    }
    async checkAccount(req, res) {
        try {
            let email = req.body;
            let find_user = await users.findOne(email).select({});


            if (find_user) {
                let code = (Math.random()).toString().split(".")[1].slice(0, 6);
                let create_genSalt = await bcrypt.genSalt(10);

                let hash_code = await bcrypt.hash(code, create_genSalt);
                sendMeailer(req.body.email, code);
                res.render("inputAccount", {
                    hash_code1: hash_code,
                    _id_user: find_user._id
                });
            } else {
                res.json({
                    status: "error",
                    message: "user not exist"
                })
            }

        } catch (error) {
            res.json({
                status: "error",
                message: error
            })
        }
    }
    async page_inputAccount(req, res) {


        let save_body = req.body;
        console.log(save_body)
        //ti nua nho xoa !
        // console.log(await check_pass(save_body.confirmCode,save_body.code_hidden))
        if (!(await check_pass(save_body.confirmCode, save_body.code_hidden))) {
            res.json({
                status: "failed"
            })
        }
        let find_user = await users.findById(save_body._id_user).select({});

        if (find_user) {
            res.render("update_password", {
                data_user: find_user
            });
        } else {
            res.json({
                status: "user not exist!"
            })
        }
        // res.render("inputAccount");

    }
    async testsign_in(req, res) {

        //    console.log(res.locals.payLoad._id)
        if (res.locals.payLoad._id) {
            // res.cookie('token', encode_jwt(res.locals.payLoad._id),
            //     { expires: new Date(Date.now() + 1900000), httpOnly: false })


            res.json({
                status: "successfully",
                user: res.locals.payLoad,
                token: encode_jwt(res.locals.payLoad._id)
            })
        } else {
            res.send("failed")
        }

    }
    async sign_in_faceBook(req, res) {
        let get_users = await users.find({});
        try {
            res.cookie('token', encode_jwt(get_users[get_users.length - 1]._id),
                { expires: new Date(Date.now() + 1900000) })

            res.redirect("/category")
        } catch (error) {
            res.render("login")
        }




    }
    async update_user_pass(req, res) {

        delete req.body.ConfirmPassWord
        let create_genSalt = await bcrypt.genSalt(10);

        let hash_code = await bcrypt.hash(req.body.passWord, create_genSalt);

        let user_update = await users.findByIdAndUpdate(req.params.id_user, { $set: { passWord: hash_code } }, { new: true });
        if (user_update) {
            res.redirect("/user/sign_in")
        }
    }
    page_sign_up(req, res) {
        res.render("sign_up")
    }
    page_sign_up2(req, res) {

        console.log(req.body)
        res.render("sign_up_step2", { form_hidden: req.body })
    }

}
module.exports = new page_user;