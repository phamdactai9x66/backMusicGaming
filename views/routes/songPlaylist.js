var express = require("express");
const SongPlaylistController = require("../app/controllers/songPlaylistController")
var router = express.Router();

router.post("/add", SongPlaylistController.createSongPlaylist);

router.get("/:idSongPlaylist", SongPlaylistController.getOne);

router.put("/:idSongPlaylist/update", SongPlaylistController.editSongPlaylist);

router.delete("/:idSongPlaylist/delete", SongPlaylistController.remove);

router.get("/", SongPlaylistController.index);


module.exports = router;