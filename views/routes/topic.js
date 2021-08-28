var express = require('express')

var router = express.Router()

const topic_Controller = require("../app/controllers/topicControllers");


router.get("/", topic_Controller.index);

router.post('/', topic_Controller.addNewTopic)
module.exports = router;