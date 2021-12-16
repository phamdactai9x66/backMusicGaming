const formidable = require("formidable");
const path = require("path");
const { statusF } = require("./variableCommon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moduleUser = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const modelUser = require("../models/user");
const CryptoJs = require("crypto-js");
const nodemailer = require("nodemailer")
const { HtmlEmail1, HtmlEmail2 } = require("./htmlEmail1");

require('dotenv').config();

const getFormInput = () => {
    let form1 = new formidable.IncomingForm();
    return (req, res, next) => {

        form1.parse(req, (err, input_all, files) => {
            if (err) {
                return res.json({
                    status: statusF,
                    message: "Wrong request !"
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
    form1.uploadDir = path.join(__dirname, "../../public/uploads");
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
                    // console.log("hellow")
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
        const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

        passWord = CryptoJs.AES.decrypt(passWord, SECRET_KEY).toString(CryptoJs.enc.Utf8);

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
                    message: "Password not match"
                })
            }
        } else {
            return res.json({
                status: statusF,
                message: "UserName been wrong"
            })
        }

    } catch (error) {
        return res.json({
            status: statusF,
            message: "We don't allow username or password is blank !"
        })
    }
}

const checkActive = (req, res, next) => {
    let { active } = res.locals.user;
    if (active == true) {
        res.locals.user = res.locals.user
        return next()
    } else {
        return res.json({
            status: statusF,
            message: "Your account not activated, Please check your email!"
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
const decode_jwt = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET)
}
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'awdawd',
    api_key: '435351667855833',
    api_secret: '15Gcbu89_cF4yThajLQLJyk6caE',
    secure: true
});
const signGoogle = async (req, res, next) => {
    if (!req || !Object.entries(req?.body).length) {
        return res.json({
            status: statusF,
            message: "body null"
        })
    }
    if (req.body.error) {
        return res.json({
            status: statusF,
            message: "You can't use this platform for login."
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
    if (!Object.entries(req?.body).length) {
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
const checkLogin = async (req, res, next) => {

    try {
        let get_token = req.headers.authorization;
        let cecode_token = await decode_jwt(get_token, process.env.JWT_SECRET);
        const find_user = await modelUser.findOne({ _id: cecode_token.sub })
        // console.log(find_user)
        if (find_user) {
            res.locals.users = find_user;
            next()
        } else {
            // res.status(401).json("We can't found your account!");
            res.json({
                status: statusF,
                message: "Không thể tìm thấy tài khoản của bạn!",
                data: []
            })

        }
    } catch (error) {
        console.log(error);
        res.json({
            status: statusF,
            message: "Xác minh thất bại."
        })
    }
}
const checkAuthe = (input_role = 0) => {
    return (req, res, next) => {
        let role = res.locals.users;
        if (role && role.role >= input_role) {

            next();
        } else {
            res.json({
                status: statusF,
                data: { currentRole: role.role },
                message: `Rất tiếc, bạn không đủ quyền để thực hiện chức năng này!:`
                // message: `We don't permission you do that, because your role have to ${input_role}!`
            })
        }


    }
}
const checkAdmin = (input_role = 2) => {
    return (req, res, next) => {
        let role = res.locals.users;
        if (role && role.role == input_role) {

            next();
        } else {
            res.json({
                status: statusF,
                data: { currentRole: role.role },
                message: `Rất tiếc, bạn không đủ quyền để thực hiện chức năng này!:`
                // message: `We don't permission you do that, because your role have to ${input_role}!`
            })
        }
    }
}
const sendMailer = async (userData) => {

    if (!userData.email) return
    let hash = encode_jwt(userData._id);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "duong.phamduc.0205@gmail.com",
            pass: "xbveafbrrvtewkgw"
        }
    })
    let option = {
        from: "MusicGaming",
        to: userData.email,
        subject: "Kích hoạt tài khoản",
        text: "You have to copy this code afterward to place it in input to our Website.",
        html: HtmlEmail1(userData, hash),
    }
    transporter.sendMail(option, (err) => {
        if (err) {
            console.log("Send email failed" + err);
        } else {
            console.log("Send email successfully, check code in your email");
        }
    })
}

const sendMailer2 = async (userData2) => {
    console.log(userData2.email)
    if (!userData2.email) return
    let hash2 = encode_jwt(userData2._id);
    let transporter2 = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "duong.phamduc.0205@gmail.com",
            pass: "xbveafbrrvtewkgw"
        }
    })
    let option2 = {
        from: "MusicGaming",
        to: userData2.email,
        subject: "Đặt lại mật khẩu",
        text: "You have to copy this code afterward to place it in input to our Website.",
        html: HtmlEmail2(userData2, hash2),
    }
    transporter2.sendMail(option2, (err) => {
        if (err) {
            console.log("Send email failed" + err);
        } else {
            console.log("Send email successfully, check code in your email");
        }
    })
}

module.exports = {
    checkConfirmPass,
    getFormInput,
    check_hash,
    encode_jwt,
    decode_jwt,
    signGoogle,
    signFacebook,
    checkLogin,
    checkAuthe,
    sendMailer,
    sendMailer2,
    checkActive,
    checkAdmin,
    cloudinary
}
