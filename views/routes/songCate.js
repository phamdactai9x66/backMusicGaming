var express = require('express')

var router = express.Router()

const songCate_Controller = require("../app/controllers/songCateControllers");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');


router.put("/:idsongCate/update", checkLogin, checkAuthe(1), songCate_Controller.editSongCate);

router.post("/add", checkLogin, checkAuthe(1), songCate_Controller.createSongcate);

router.delete("/:idsongCate/delete", checkLogin, checkAuthe(1), songCate_Controller.deleteSongCate);

router.get("/:idsongCate", songCate_Controller.getOne);
router.get("/", songCate_Controller.index);
module.exports = router;