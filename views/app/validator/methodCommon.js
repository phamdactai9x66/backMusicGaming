const formidable = require("formidable");
const path = require("path");
const { statusF, statusS } = require("./variableCommon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moduleUser = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.client_id_google)
const modelUser = require("../models/user");
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
const signGoogle = async (req, res, next) => {
    if (!req || !Object.entries(req.body).length) {
        return res.json({
            status: statusF,
            message: "body null"
        })
    }
    let { googleId, email, givenName, familyName, imageUrl } = req.body.profileObj
    const condition = {
        authType: "google",
        email,
        google_id: googleId
    }
    const user1 = await modelUser.findOne(condition)
    if (user1) {
        res.locals.payLoad = user1;
        return next()
    } else {
        const params = {
            google_id: googleId,
            authType: "google",
            email: email,
            first_name: givenName,
            last_name: familyName,
            userName: email,
            avatar: imageUrl,
            address: "",
            active: true
        }
        const new_user = new modelUser(params);
        new_user.save(async (err, new_user1) => {
            if (err) {
                return res.json({
                    status: statusF,
                    message: "Email of this account been exist,blease select another account."
                })
            }
            res.locals.payLoad = await new_user1;
            return next()
        });
    }
}
const signFacebook = async (req, res, next) => {
    if (!Object.entries(req.body).length) {
        return res.json({
            status: statusF,
            message: "body null"
        })
    }
    let { name, email, picture: { data: { url } }, id } = req.body;
    const condition = {
        authType: "facebook",
        email,
        facebook_id: id
    }
    const user1 = await modelUser.findOne(condition)
    if (user1) {
        res.locals.payLoad = user1;
        return next()

    } else {
        const params = {
            facebook_id: id,
            authType: "facebook",
            email: email,
            first_name: name,
            last_name: "",
            userName: email,
            avatar: url,
            address: "",
            active: true
        }
        const new_user = new modelUser(params);
        new_user.save(async (err, new_user1) => {
            if (err) {
                return res.json({
                    status: statusF,
                    message: "Email of this account been exist,blease select another account."
                })
            }
            res.locals.payLoad = await new_user1;
            return next()
        });
    }
}
module.exports = {
    checkConfirmPass,
    getFormInput,
    check_hash,
    encode_jwt,
    decode_jwt,
    signGoogle,
    signFacebook
}
