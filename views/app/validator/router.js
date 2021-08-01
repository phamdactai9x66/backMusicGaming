const joi = require("@hapi/joi");
const formidable = require("formidable")

const path = require("path");
const validaparam = (validation, name) => {
    return (req, res, next) => {
        const validation_param = validation.validate({ id: req.params[name] })
        if (validation_param.error) {
            res.json({
                status: validation_param.error
            })
        } else {
            if (!req.value) { req.value = {} }
            if (!req.value.params) { req.value.params = {} }
            req.value.params[name] = req.params[name];
            next();
        }
    }
}
const valida_body = (req, res, next) => {
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
const valida_body_not_file = (validation) => {
    let form1 = new formidable.IncomingForm();
    return (req, res, next) => {

        form1.parse(req, (err, input_all, files) => {
            const validation_body = validation.validate(input_all);
            if (validation_body.error) {
                res.json({
                    status: "failed",
                    message: validation_body.error
                })
            } else {
                if (!req.value) { req.value = {} }
                if (!req.value.params) { req.value.params = {} }

                req.body = validation_body.value;

                next();
            }
        })

    }
}


const validator = {
    id_chema: joi.object().keys({
        id: joi.string().regex(/^[\dA-z]{1,24}$/)
    }),
    update_pass: joi.object().keys({

        passWord: joi.string().regex(/^(?=.*[a-z]).{6,}$/).required(),
        ConfirmPassWord: joi.string().valid(joi.ref("passWord")).required()
    })
    ,
    body_user: joi.object().keys({
        first_name: joi.string().min(2).trim().required(),
        last_name: joi.string().min(2).trim().required()
    }),
    check_sign_in: joi.object().keys({
        userName: joi.string().required(),
        passWord: joi.string().required()
    }),
    check_product: joi.object().keys({
        name: joi.string().min(2).trim().required(),
        name_english: joi.string().min(2).trim().required(),
        quantity: joi.number().integer().required(),
        price: joi.number().required(),
        describe: joi.string().min(2).trim(),
        id_cate: joi.string().regex(/^[\dA-z]{1,24}$/)
    }),
    body_user_update: joi.object().keys({
        first_name: joi.string().min(2).trim().required(),
        last_name: joi.string().min(2).trim().required(),
        address: joi.string().trim().required(),
        email: joi.string().email().trim().required(),
        image: joi.string().default(""),
        gender: joi.string()
    }),
    check_email_user: joi.object().keys({
        email: joi.string().email().trim().required()
    }),
    checkComment: joi.object().keys({
        id_Product: joi.string().regex(/^[\dA-z]{1,24}$/),
        id_User: joi.string().regex(/^[\dA-z]{1,24}$/),
        rangeStart: joi.number().min(1).max(5).default(5),
        title: joi.string().required().trim().max(255),
        comment: joi.string().required().trim(),
        status: joi.number().default(0)
    }),
    checkImages: joi.object().keys({
        title: joi.string().required().trim().max(255),
        image: joi.string().required().trim(),
        idProduct: joi.string().regex(/^[\dA-z]{1,24}$/)
    })

}

module.exports = { validaparam, validator, valida_body, valida_body_not_file };