var express = require('express')

var router = express.Router()

const playlist_Controller = require("../app/controllers/playlistControllers");


router.get("/", playlist_Controller.index);
module.exports = router;