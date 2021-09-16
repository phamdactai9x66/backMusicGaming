var express = require('express')

var router = express.Router()

const comment_Controller = require("../app/controllers/commentController");

router.post("/add", comment_Controller.create);

router.put("/:idComment/update", comment_Controller.edit);

router.delete("/:idComment/delete", comment_Controller.delete)

router.get("/", comment_Controller.index);

module.exports = router;