var express = require('express')

var router = express.Router()
const { checkConfirmPass, getFormInput, check_hash, signGoogle, signFacebook, checkLogin, checkAuthe, checkActive, checkAdmin } = require("../app/validator/methodCommon");
const user_Controller = require("../app/controllers/userController");

router.post("/login/google", signGoogle, user_Controller.loginGlobal)

router.post("/login/facebook", signFacebook, user_Controller.loginGlobal)

router.post("/signUp", checkConfirmPass, user_Controller.signUp);

router.put("/verifyUser/:idUser/:hash", user_Controller.verifyUser)

router.post("/login", getFormInput(), check_hash, checkActive, user_Controller.login)

router.post("/forgotPassword", user_Controller.checkAccount)

router.put("/resetPassword/:idUser/:hash", user_Controller.resetPassword)

router.delete("/:idUser/delete", checkLogin, checkAuthe(0), user_Controller.deleteOne)

router.put("/:idUser/update", checkLogin, checkAuthe(2), user_Controller.editUser)

router.get("/:idUser", checkLogin, checkAuthe(), user_Controller.getOne);

router.get("/", checkLogin, checkAuthe(0), user_Controller.index);
module.exports = router;