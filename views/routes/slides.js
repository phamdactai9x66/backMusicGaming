var express = require('express')

var router = express.Router()

const slide_Controller = require("../app/controllers/slideController");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.get("/", slide_Controller.index);

router.get("/:idSlide", slide_Controller.getOne);

router.post("/add", checkLogin, checkAuthe(1), slide_Controller.createSlide);

router.put("/:idSlide/update", checkLogin, checkAuthe(1), slide_Controller.editSlide);

router.delete("/:idSlide/delete", checkLogin, checkAuthe(1), slide_Controller.deleteSlide);

module.exports = router;