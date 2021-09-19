var express = require('express')

var router = express.Router()

const likeSong_Controller = require("../app/controllers/likeSongController");

router.post("/add", likeSong_Controller.create);

router.put("/:idLikeSong/update", likeSong_Controller.update);

router.delete("/:idLikeSong/delete", likeSong_Controller.delete)

router.get("/", likeSong_Controller.index);

module.exports = router;