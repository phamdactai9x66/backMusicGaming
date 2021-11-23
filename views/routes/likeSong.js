var express = require('express')

var router = express.Router()

const likeSong_Controller = require("../app/controllers/likeSongController");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.post("/add", checkLogin, checkAuthe(), likeSong_Controller.create);

router.put("/:idLikeSong/update", checkLogin, checkAuthe(), likeSong_Controller.update);

router.delete("/:idLikeSong/delete", checkLogin, checkAuthe(), likeSong_Controller.delete)

router.get("/", checkLogin, checkAuthe(), likeSong_Controller.index);

module.exports = router;