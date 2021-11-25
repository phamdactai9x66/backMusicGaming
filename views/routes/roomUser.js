var express = require("express");
const roomUserController = require("../app/controllers/roomUserController");
const { checkLogin, checkAuthe } = require("../app/validator/methodCommon");

var router = express.Router();

router.post("/add", checkLogin, checkAuthe(), roomUserController.create);

router.get("/:idRoomUser", checkLogin, checkAuthe(), roomUserController.getOne);

router.put("/:idRoomUser/update", checkLogin, checkAuthe(), roomUserController.update);

router.delete("/:idRoomUser/delete", checkLogin, checkAuthe(), roomUserController.delete);

router.get("/", checkLogin, checkAuthe(1), roomUserController.index);


module.exports = router;