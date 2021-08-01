var express = require('express')

var router = express.Router()

const comment_Controller = require("../app/controllers/commentControllers");


const { check_login, checkAuthe } = require("../app/validator/method_common");
const { validaparam, validator, valida_body_not_file } = require("../app/validator/router");

router.post("/add/:tokenUser", check_login, checkAuthe(0),
    valida_body_not_file(validator.checkComment), comment_Controller.creactComment);

router.put("/:idComment/update/:tokenUser", check_login, checkAuthe(1),
    valida_body_not_file(validator.checkComment), comment_Controller.updateComment);

router.delete("/:idComment/:tokenUser", check_login, checkAuthe(1), comment_Controller.deleteOne);

router.get("/", comment_Controller.index);


//check_login 


module.exports = router;