var express = require('express')

var router = express.Router()

const topic_Controller = require("../app/controllers/topicControllers");


router.put("/:idTopic/update", topic_Controller.updateTopic);

router.delete("/:idTopic/delete", topic_Controller.deleteTopic)

router.post('/add', topic_Controller.addNewTopic)

router.get("/:idTopic", topic_Controller.getOne);

router.get("/", topic_Controller.index);

module.exports = router;