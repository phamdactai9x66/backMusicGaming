var express = require('express')

var router = express.Router()
const { checkConfirmPass, getFormInput, check_hash } = require("../app/validator/methodCommon");
const user_Controller = require("../app/controllers/userController");


router.post("/signUp", checkConfirmPass, user_Controller.signUp);

router.post("/signIn", getFormInput(), check_hash, user_Controller.signIn)

router.delete("/:idUser/delete", user_Controller.deleteOne)

router.put("/:idUser/update", user_Controller.editUser)

router.get("/:idUser", user_Controller.getOne);

router.get("/", user_Controller.index);
module.exports = router;