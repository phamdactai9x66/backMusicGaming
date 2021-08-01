var express = require('express')

var router = express.Router()

const about_Controller=require("../app/controllers/sideControllers");
const { check_login, checkAuthe } = require("../app/validator/method_common");

router.get("/",check_login,about_Controller.index);
module.exports= router;