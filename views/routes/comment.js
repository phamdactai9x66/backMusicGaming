var express = require('express')

var router = express.Router()

const comment_Controller = require("../app/controllers/commentController");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.post("/add", checkLogin, checkAuthe(), comment_Controller.create);

router.put("/:idComment/update", checkLogin, checkAuthe(), comment_Controller.edit);

router.delete("/:idComment/delete", checkLogin, checkAuthe(), comment_Controller.delete)

router.get("/", comment_Controller.index);

module.exports = router;