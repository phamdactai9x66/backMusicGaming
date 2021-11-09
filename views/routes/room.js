var express = require('express')

var router = express.Router()

const room_Controller = require("../app/controllers/roomController");

router.get("/", room_Controller.index);

router.get("/:idRoom", room_Controller.getOne);

// router.get("/:idRoom", room_Controller.enterRoom);

router.post("/add", room_Controller.createRoom);

router.put("/:idRoom/update", room_Controller.editRoom);

router.delete("/:idRoom/delete", room_Controller.deleteRoom);

module.exports = router;