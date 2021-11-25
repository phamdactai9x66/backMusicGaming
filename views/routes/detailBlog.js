var express = require('express')

var router = express.Router()

const detailBlog_Controller = require("../app/controllers/detailBlogController");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.post("/add", checkLogin, checkAuthe(0), detailBlog_Controller.create);

router.put("/:idDetailBlog/update", checkLogin, checkAuthe(0), detailBlog_Controller.edit);

router.delete("/:idDetailBlog/delete", checkLogin, checkAuthe(0), detailBlog_Controller.delete)

router.get("/:idDetailBlog", detailBlog_Controller.getOne);

router.get("/", detailBlog_Controller.index);

module.exports = router;