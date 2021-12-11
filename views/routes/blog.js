var express = require('express')
const blogController = require('../app/controllers/blogController');
const { checkLogin, checkAuthe, checkAdmin } = require('../app/validator/methodCommon');
var router = express.Router();

router.post("/add", checkLogin, checkAuthe(0), blogController.createBlog);
router.delete("/:id_blog/delete", checkLogin, checkAuthe(0), blogController.removeBlog);
router.put("/:id_blog/update", checkLogin, checkAuthe(0), blogController.updateBlog)

router.put("/:id_blog/pass", checkLogin, checkAdmin(), blogController.checkpass)

router.get("/", blogController.index);
module.exports = router;