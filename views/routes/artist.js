var express = require('express')

var router = express.Router()

const artist_Controller = require("../app/controllers/artistControllers");
const { checkLogin, checkAuthe, checkAdmin } = require('../app/validator/methodCommon');

router.post("/add", checkLogin, checkAuthe(0), artist_Controller.createArtist);

router.put("/:idArtist/update", checkLogin, checkAuthe(0), artist_Controller.editArtist);

router.put("/:idArtist/pass", checkLogin, checkAdmin(), artist_Controller.checkpass);

router.delete("/:idArtist/delete", checkLogin, checkAuthe(0), artist_Controller.deleteArtist)

router.get("/:idArtist", artist_Controller.getOne);

router.get("/", artist_Controller.index);
module.exports = router;