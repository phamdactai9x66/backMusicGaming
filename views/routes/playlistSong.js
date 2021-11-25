var express = require("express");
const playlistSong_Controller = require("../app/controllers/playlistSong");
const { checkLogin, checkAuthe } = require("../app/validator/methodCommon");

var router = express.Router();

router.post("/add", checkLogin, checkAuthe(1), playlistSong_Controller.createPlaylistSong);

router.get("/:idPlaylistSong", playlistSong_Controller.getOne);

router.put("/:idPlaylistSong/update", checkLogin, checkAuthe(1), playlistSong_Controller.updatePlaylistSong);

router.delete("/:idPlaylistSong/delete", checkLogin, checkAuthe(1), playlistSong_Controller.delete);

router.get("/", playlistSong_Controller.index);


module.exports = router;
