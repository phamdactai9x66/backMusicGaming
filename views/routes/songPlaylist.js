var express = require("express");
const SongPlaylistController = require("../app/controllers/songPlaylistController");
const { checkLogin, checkAuthe } = require("../app/validator/methodCommon");
var router = express.Router();

router.post("/add", checkLogin, checkAuthe(0), SongPlaylistController.createSongPlaylist);

router.get("/:idSongPlaylist", SongPlaylistController.getOne);

router.put("/:idSongPlaylist/update", checkLogin, checkAuthe(0), SongPlaylistController.editSongPlaylist);

router.delete("/:idSongPlaylist/delete", checkLogin, checkAuthe(0), SongPlaylistController.remove);

router.get("/", SongPlaylistController.index);


module.exports = router;