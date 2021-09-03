var express = require('express')

var router = express.Router()

const slide_Controller = require("../app/controllers/slideController");

router.get("/", slide_Controller.index);

router.get("/:idSlide", slide_Controller.getOne);

router.post("/add", slide_Controller.createSlide);

router.put("/:idSlide/update", slide_Controller.editSlide);

router.delete("/:idSlide/delete", slide_Controller.deleteSlide);

module.exports = router;