const { Router } = require('express');
var express = require('express')

var router = express.Router()

const image_Controller = require("../app/controllers/imageController");


const { check_login, checkAuthe } = require("../app/validator/method_common");
const { validaparam, validator, valida_body_not_file } = require("../app/validator/router");

// router.post("/add", valida_body_not_file(validator.checkComment), comment_Controller.creactComment);
router.post("/add/:tokenUser", check_login, checkAuthe(1), image_Controller.createImage);

router.put("/:id_product/update/:tokenUser", check_login, checkAuthe(1), image_Controller.updateImage)

router.delete("/:id_product/:tokenUser", check_login, checkAuthe(1), image_Controller.delete);

router.get("/", image_Controller.index);


//check_login 


module.exports = router;