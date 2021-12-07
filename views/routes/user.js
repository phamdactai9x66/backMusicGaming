var express = require('express')

var router = express.Router()
const { checkConfirmPass, getFormInput, check_hash, signGoogle, signFacebook, checkLogin, checkAuthe, sendMailer, checkActive } = require("../app/validator/methodCommon");
const user_Controller = require("../app/controllers/userController");

router.post("/login/google", signGoogle, user_Controller.loginGlobal)

router.post("/login/facebook", signFacebook, user_Controller.loginGlobal)

router.post("/signUp", checkConfirmPass, user_Controller.signUp);

router.get("/verifyUser/:idUser/:hash", user_Controller.verifyUser)

router.post("/login", getFormInput(), check_hash, checkActive, user_Controller.login)
router.post("/forgetPassword", user_Controller.checkAccount)

router.delete("/:idUser/delete", checkLogin, checkAuthe(0), user_Controller.deleteOne)

router.put("/:idUser/update", checkLogin, checkAuthe(), user_Controller.editUser)

router.put("/:idUser/pass", checkLogin, checkAuthe(), user_Controller.checkpass)

router.get("/:idUser", checkLogin, checkAuthe(), user_Controller.getOne);

router.get("/", checkLogin, checkAuthe(0), user_Controller.index);
module.exports = router;