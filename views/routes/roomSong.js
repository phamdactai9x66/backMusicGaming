var express = require("express");
const roomSongController = require("../app/controllers/roomSongController");

var router = express.Router();

router.post("/add", roomSongController.create);

router.get("/:idRoomSong", roomSongController.getOne);

router.put("/:idRoomSong/update", roomSongController.update);

router.delete("/:idRoomSong/delete", roomSongController.delete);

router.get("/", roomSongController.index);


module.exports = router;