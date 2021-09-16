var express = require("express");
const playlistSong_Controller = require("../app/controllers/playlistSong");

var router = express.Router();

router.post("/add", playlistSong_Controller.createPlaylistSong);

router.get("/:idPlaylistSong", playlistSong_Controller.getOne);

router.put("/:idPlaylistSong/update", playlistSong_Controller.updatePlaylistSong);

router.delete("/:idPlaylistSong/delete", playlistSong_Controller.delete);

router.get("/", playlistSong_Controller.index);


module.exports = router;
