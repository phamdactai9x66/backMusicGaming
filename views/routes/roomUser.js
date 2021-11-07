var express = require("express");
const roomUserController = require("../app/controllers/roomUserController");

var router = express.Router();

router.post("/add", roomUserController.create);

router.get("/:idRoomUser", roomUserController.getOne);

router.put("/:idRoomUser/update", roomUserController.update);

router.delete("/:idRoomUser/delete", roomUserController.delete);

router.get("/", roomUserController.index);


module.exports = router;