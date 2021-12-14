var express = require('express')

var router = express.Router()

const song_Controller = require("../app/controllers/songControlers");
const { checkLogin, checkAuthe, checkAdmin } = require('../app/validator/methodCommon');


router.post("/add", checkLogin, checkAuthe(0), song_Controller.createSong);

router.delete("/:idsong/delete", checkLogin, checkAuthe(0), song_Controller.deleteSong)

router.put("/:idsong/update", checkLogin, checkAuthe(0), song_Controller.editSong)

router.put("/:idsong/pass", checkLogin, checkAdmin(), song_Controller.checkpass)

router.get("/:idsong", song_Controller.getOne)
// router.get("/song/admin", song_Controller.index);
router.get("/", song_Controller.index);
module.exports = router;