const bcrypt = require("bcrypt");
const { JWT_SECRET, user_email, pass_email } = require("../../config/variable_global");
const user = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const e = require("express");
let formidable = require("formidable");
const deCode_jwt = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

const client_id = '600015660380-qhdnj20hloeapcl0tphsg9r3a30tam2u.apps.googleusercontent.com';
const { OAuth2Client } = require("google-auth-library");
const { object } = require("@hapi/joi");
const client = new OAuth2Client(client_id)

module.exports = {
    host: "http://localhost:5000"
    ,
    async sign_google(req, res, next) {
        console.log(Object.entries(req.body).length, "xin chao")
        console.log(req.body)
        if (!Object.entries(req.body).length) { return }
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: client_id,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();

        const condition = {
            authType: "google",
            email: payload.email
        }
        const user1 = await user.findOne(condition)
        if (user1) {
            res.locals.payLoad = user1;
            console.log("we have  this account in db");
            next()
            return;
        } else {
            const params = {
                google_id: payload.jti,
                authType: "google",
                email: payload.email,
                first_name: payload.given_name,
                last_name: payload.family_name,
                userName: payload.email,
                avatar: payload.picture,
                address: ""
            }
            const new_user = new user(params).save()
            console.log("xin caho")
            res.locals.payLoad = await new_user;
            next()
        }


    },
    async sendMeailer(email_user = "", code) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: user_email,
                pass: pass_email
            }
        })
        let option = {
            from: user_email,
            to: email_user,
            subject: "Confirm Code",
            text: "You have to copy this code afterward to place it in input to our Website.",
            html: `<h1>Code: ${code}</h1>`
        }
        transporter.sendMail(option, (err) => {
            if (err) {
                console.log("Send email failed" + err);
            } else {
                console.log("Send email successfully,check code in your email");
            }
        })
    }
    ,
    async check_pass(input_pass, user_pass) {

        try {
            return bcrypt.compare(input_pass, user_pass);
        } catch (error) {
            throw new Error(error)
        }
    },
    async check_login(req, res, next) {

        try {
            let get_token = req.params.tokenUser;

            let cecode_token = deCode_jwt(get_token, JWT_SECRET);
            const find_user = await user.findOne({ _id: cecode_token.sub })
            if (find_user) {
                res.locals.users = find_user;
                next()
            } else {
                // res.status(401).json("We can't found your account!");
                res.json({
                    status: "failed",
                    message: "We can't found your account!",
                    data: []
                })

            }
        } catch (error) {
            // res.status(401).json("Token not exist!");
            console.log("xin caho")
            res.json({
                status: "failed",
                message: "The process authentication been failed."
            })

        }

    },
    checkAuthe(input_role = 0) {
        return (req, res, next) => {
            let role = res.locals.users;
            if (role.role >= input_role) {

                next();
            } else {
                res.json({
                    status: "failed",
                    data: [],
                    message: `We don't permission you do that, because your role have to ${input_role}!`
                })
            }


        }
    },
    async check_hash(req, res, next) {
        try {
            let { userName, passWord } = req.body;
            const find_user = await user.findOne({ userName })
            if (typeof find_user == "object") {
                const check_compar_pass = await bcrypt.compare(passWord, find_user.passWord);
                if (check_compar_pass) {
                    res.locals.user = find_user
                    next()
                } else {
                    res.json({
                        status: "failed",
                        message: "password not match"
                    })
                }
            }
        } catch (error) {
            res.json({
                status: "failed",
                message: "You can't Sign in"
            })
        }
    }



}