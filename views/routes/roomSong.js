var express = require("express");
const roomSongController = require("../app/controllers/roomSongController");
const { checkLogin, checkAuthe } = require("../app/validator/methodCommon");

var router = express.Router();

router.post("/add", checkLogin, checkAuthe(), roomSongController.create);

router.get("/:idRoomSong", checkLogin, checkAuthe(), roomSongController.getOne);

router.put("/:idRoomSong/update", checkLogin, checkAuthe(), roomSongController.update);

router.delete("/:idRoomSong/delete", checkLogin, checkAuthe(), roomSongController.delete);

router.get("/", checkLogin, checkAuthe(), roomSongController.index);


module.exports = router;