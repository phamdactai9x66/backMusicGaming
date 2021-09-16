var express = require('express')

var router = express.Router()
const { checkConfirmPass, getFormInput, check_hash, signGoogle, signFacebook } = require("../app/validator/methodCommon");
const user_Controller = require("../app/controllers/userController");

router.post("/login/google", signGoogle, user_Controller.loginGlobal)

router.post("/login/facebook", signFacebook, user_Controller.loginGlobal)

router.post("/signUp", checkConfirmPass, user_Controller.signUp);

router.post("/login", getFormInput(), check_hash, user_Controller.login)

router.delete("/:idUser/delete", user_Controller.deleteOne)

router.put("/:idUser/update", user_Controller.editUser)

router.get("/:idUser", user_Controller.getOne);

router.get("/", user_Controller.index);
module.exports = router;