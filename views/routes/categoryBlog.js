var express = require('express');
var router = express.Router();

const categoryBlogController = require('../app/controllers/categoryBlogController')

router.post('/add', categoryBlogController.createCategoryBlog);
router.put('/:idCategoryBlog/update', categoryBlogController.editCategoryBlog);
router.delete('/:idCategoryBlog/delete', categoryBlogController.deleteCategoryBlog);

router.get("/", categoryBlogController.index);

module.exports = router;