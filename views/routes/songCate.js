var express = require('express')

var router = express.Router()

const songCate_Controller = require("../app/controllers/songCateControllers");


router.put("/:idsongCate/update", songCate_Controller.editSongCate);

router.post("/add", songCate_Controller.createSongcate);

router.delete("/:idsongCate/delete", songCate_Controller.deleteSongCate);

router.get("/:idsongCate", songCate_Controller.getOne);
router.get("/", songCate_Controller.index);
module.exports = router;