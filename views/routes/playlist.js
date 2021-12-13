var express = require('express')

var router = express.Router()

const playlist_Controller = require("../app/controllers/playlistControllers");
const { checkLogin, checkAuthe, checkAdmin } = require('../app/validator/methodCommon');


// router.post("/", playlist_Controller.createPlaylist);

// router.get("/:idPlaylist", playlist_Controller.getOne);
router.get("/", playlist_Controller.index);
router.get('/:id', playlist_Controller.getOnePlaylist);

router.post('/add', checkLogin, checkAuthe(0), playlist_Controller.addNewPlayList);

router.delete('/delete/:id', checkLogin, checkAuthe(0), playlist_Controller.removePlayList);

router.put('/:id/update', checkLogin, checkAuthe(0), playlist_Controller.updatePlayList);


module.exports = router;