var express = require('express')

var router = express.Router()

const detailBlog_Controller = require("../app/controllers/detailBlogController");

router.post("/add", detailBlog_Controller.create);

router.put("/:idDetailBlog/update", detailBlog_Controller.edit);

router.delete("/:idDetailBlog/delete", detailBlog_Controller.delete)

router.get("/:idDetailBlog", detailBlog_Controller.getOne);

router.get("/", detailBlog_Controller.index);

module.exports = router;