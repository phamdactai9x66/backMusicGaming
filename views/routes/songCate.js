var express = require('express')

var router = express.Router()

const songCate_Controller = require("../app/controllers/songCateControllers");


router.get("/", songCate_Controller.index);
module.exports = router;