const formidable = require("formidable");
const path = require("path");
const { statusF } = require("./variableCommon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moduleUser = require("../models/user");
const getFormInput = () => {
    let form1 = new formidable.IncomingForm();
    return (req, res, next) => {

        form1.parse(req, (err, input_all, files) => {
            if (err) {
                return res.json({
                    status: statusF,
                    message: err
                })
            } else {

                req.body = input_all;

                next();
            }
        })

    }
}
const checkConfirmPass = (req, res, next) => {
    let form1 = new formidable.IncomingForm();
    form1.uploadDir = path.join(__dirname, "../../public/imageUser");
    form1.keepExtensions = true;
    form1.maxFieldsSize = 1 * 1024 * 1024;
    form1.multiples = false;

    form1.parse(req, (err, input_all, files) => {

        let save1 = { ...input_all }
        delete save1.image;
        let checkEmpty = Object.entries(save1).every((value) => value[1] != "");
        if (checkEmpty) {
            if (input_all.passWord == input_all.confirmPassWord) {

                req.body = { ...input_all };

                if (files["image"]) {
                    res.locals.image_user = files["image"]
                    console.log("hellow")
                }
                next();
            } else {

                res.status(200).json({
                    status: "failed",
                    message: "confirmPassWord not match."
                })

            }
        } else {
            res.status(200).json({
                status: "failed",
                message: "you have to provide all fileds."
            })

        }
    })
}
const check_hash = async (req, res, next) => {
    try {


        let { userName, passWord } = req.body;
        const condition = {
            userName: userName.trim()
        }
        const find_user = await moduleUser.findOne(condition)
        if (find_user != null) {
            const check_compar_pass = await bcrypt.compare(passWord, find_user.passWord);
            if (check_compar_pass) {
                res.locals.user = find_user
                return next()
            } else {
                return res.json({
                    status: statusF,
                    message: "password not match"
                })
            }
        } else {
            return res.json({
                status: statusF,
                message: "userName been wrong"
            })
        }

    } catch (error) {
        return res.json({
            status: statusF,
            message: "We don't allow username or password is blank !"
        })
    }
}
const encode_jwt = (idUser) => {
    return jwt.sign({
        iss: "Pham dac tai",
        sub: idUser,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 10)
    }, process.env.JWT_SECRET)
}
const decode_jwt = (token) => {
    return jwt.verify(token, JWT_SECRET)
}
module.exports = {
    checkConfirmPass,
    getFormInput,
    check_hash,
    encode_jwt,
    decode_jwt
}
