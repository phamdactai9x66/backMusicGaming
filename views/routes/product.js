var express = require('express')

var router = express.Router()

const productController = require("../app/controllers/productController");
const { query, validationResult } = require("express-validator");
const { check_login, checkAuthe } = require("../app/validator/method_common");

const { validaparam, validator, valida_body, valida_body_not_file } = require("../app/validator/router");


// router.get("/test123", productController.test123);

// router.get("/add", check_login, checkAuthe(1), productController.pageAddProduct);

router.put("/:id_product/update/:tokenUser", check_login, checkAuthe(1),
    productController.check_exist_product,
    // valida_body_not_file(validator.check_product),
    productController.update_product);

router.post("/add/:tokenUser", check_login, checkAuthe(0), productController.create_product);

router.delete("/:id_product/:tokenUser", check_login, checkAuthe(1), productController.delete_product);

router.get("/:id_product", productController.detail_product);

router.get("/", productController.index);

module.exports = router;