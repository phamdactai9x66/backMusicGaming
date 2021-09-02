var express = require('express')

var router = express.Router()

const song_Controller = require("../app/controllers/songControlers");


router.post("/add", song_Controller.createSong);

router.delete("/:idsong/delete", song_Controller.deleteSong)

router.put("/:idsong/update", song_Controller.editSong)

router.get("/:idsong", song_Controller.getOne)
router.get("/", song_Controller.index);
module.exports = router;