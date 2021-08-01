var express = require('express')

var router = express.Router()

const about_Controller = require("../app/controllers/aboutControllers");

const side_Controller = require("../app/controllers/sideControllers");

const { check_login, checkAuthe } = require("../app/validator/method_common");


router.delete("/:id_cate/:tokenUser", check_login, checkAuthe(1), about_Controller.delete_cate);
router.put("/:id_cate/update/:tokenUser", check_login, checkAuthe(1), about_Controller.edit_cate);

router.post("/add/:tokenUser", check_login, checkAuthe(1), about_Controller.index_create_cate);
router.get("/:idCate", about_Controller.finOneCate);
router.get("/", side_Controller.index);


//check_login 


module.exports = router;