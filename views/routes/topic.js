var express = require('express')

var router = express.Router()

const topic_Controller = require("../app/controllers/topicControllers");
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');


router.put("/:idTopic/update", checkLogin, checkAuthe(1), topic_Controller.updateTopic);

router.delete("/:idTopic/delete", checkLogin, checkAuthe(1), topic_Controller.deleteTopic)

router.post('/add', checkLogin, checkAuthe(1), topic_Controller.addNewTopic)

router.get("/:idTopic", topic_Controller.getOne);

router.get("/", topic_Controller.index);

module.exports = router;