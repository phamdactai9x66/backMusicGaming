var express = require("express");
const songsArtistController = require("../app/controllers/songsArtistController");
const { checkLogin, checkAuthe } = require("../app/validator/methodCommon");

var router = express.Router();

router.post("/add", checkLogin, checkAuthe(1), songsArtistController.create);

router.get("/:idSongsArtist", songsArtistController.getOne);

router.put("/:idSongsArtist/update", checkLogin, checkAuthe(1), songsArtistController.update);

router.delete("/:idSongsArtist/delete", checkLogin, checkAuthe(1), songsArtistController.delete);

router.get("/", songsArtistController.index);


module.exports = router;
