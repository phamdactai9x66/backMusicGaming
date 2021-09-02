var express = require("express");
const playlistSong_Controller = require("../app/controllers/playlistSong");

var router = express.Router();

router.get("/", playlistSong_Controller.index);

module.exports = router;
