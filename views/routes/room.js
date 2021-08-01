const { Router } = require('express');
var express = require('express')

var router = express.Router()

const room_Controller = require("../app/controllers/roomControllers");


const { check_login, checkAuthe } = require("../app/validator/method_common");
const { validaparam, validator, valida_body_not_file } = require("../app/validator/router");

// router.post("/add", valida_body_not_file(validator.checkComment), comment_Controller.creactComment);

router.post("/addRoom", room_Controller.newRoom);
router.get("/", room_Controller.index);


//check_login 


module.exports = router;