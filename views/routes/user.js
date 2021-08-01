var express = require('express')

var router = express.Router()

const passport = require("passport");
let { check_hash } = require("../app/validator/method_common")
const user = require("../app/controllers/userControllers");
const { validaparam, validator, valida_body, valida_body_not_file } = require("../app/validator/router");
const { check_login, checkAuthe, sign_google } = require("../app/validator/method_common");


router.post("/user/testsign_in", sign_google, user.testsign_in);



router.get("/auth/facebook", passport.authenticate("facebook"));


router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/user/login/faceBook' }));

router.get("/login/faceBook", user.sign_in_faceBook);


router.get("/Account/checkAccount", user.page_checkAccount);
router.post("/Account/checkAccount", valida_body_not_file(validator.check_email_user), user.checkAccount);
router.post("/Account/checkAccount/inputACcount", user.page_inputAccount);
router.put("/Account/checkAccount/inputACcount/:id_user", valida_body_not_file(validator.update_pass), user.update_user_pass);



router.post("/sign_in",
    valida_body_not_file(validator.check_sign_in),
    check_hash,
    user.sign_in)

router.post("/sign_up", valida_body, user.sign_up);

router.post("/sign_upAdmin/:tokenUser", check_login, checkAuthe(2), valida_body, user.sign_up);
// router.get("/sign_up", user.page_sign_up);
// router.post("/sign_up/sign_up_step2", user.page_sign_up2);

// router.get("/sign_in", check_login, user.sign_in);
router.delete("/:idUser/:tokenUser", check_login, checkAuthe(2), user.deleteUser)

router.get("/signOut/:tokenUser", user.signOut);
router.put("/Account/:tokenUser", check_login, valida_body, user.updateProfile);
router.put("/Account/UpdateByAdmin/:idUser/:tokenUser", check_login, checkAuthe(2), valida_body, user.updateUser);
router.put("/Account/UpdatePassWord/:idUser/:tokenUser", check_login, checkAuthe(2), valida_body, user.updateUser);
router.get("/Account/:tokenUser", check_login, user.pageProfile);
router.get("/:idUser", user.getOneUser)
router.get("/", user.index)


// router.get("/", check_login, user.index);

module.exports = router;
//autentica