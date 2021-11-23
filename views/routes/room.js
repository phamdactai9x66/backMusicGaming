var express = require('express')

var router = express.Router()

const room_Controller = require("../app/controllers/roomController");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.get("/", checkLogin, checkAuthe(), room_Controller.index);

router.get("/:idRoom", checkLogin, checkAuthe(), room_Controller.getOne);

// router.get("/:idRoom", room_Controller.enterRoom);
router.post("/checkPassword", checkLogin, checkAuthe(), room_Controller.enterRoom);
router.post("/add", checkLogin, checkAuthe(), room_Controller.createRoom);

router.put("/:idRoom/update", checkLogin, checkAuthe(), room_Controller.editRoom);

router.delete("/:idRoom/delete", checkLogin, checkAuthe(), room_Controller.deleteRoom);

module.exports = router;