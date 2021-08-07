var express = require('express')

var router = express.Router()

const about_Controller = require("../app/controllers/sideControllers");


router.get("/", about_Controller.index);
module.exports = router;