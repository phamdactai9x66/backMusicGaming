var express = require("express");
const songsArtistController = require("../app/controllers/songsArtistController");

var router = express.Router();

router.post("/add", songsArtistController.create);

router.get("/:idSongsArtist", songsArtistController.getOne);

router.put("/:idSongsArtist/update", songsArtistController.update);

router.delete("/:idSongsArtist/delete", songsArtistController.delete);

router.get("/", songsArtistController.index);


module.exports = router;
