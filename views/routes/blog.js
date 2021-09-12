var express = require('express')
const blogController = require('../app/controllers/blogController')
var router = express.Router();

router.post("/add", blogController.createBlog);
router.delete("/:id_blog/delete", blogController.removeBlog);
router.put("/:id_blog/update", blogController.updateBlog)

router.get("/", blogController.index);
module.exports = router;