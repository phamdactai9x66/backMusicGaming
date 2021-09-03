var express = require('express')

var router = express.Router()

const playlist_Controller = require("../app/controllers/playlistControllers");


// router.post("/", playlist_Controller.createPlaylist);

// router.get("/:idPlaylist", playlist_Controller.getOne);
router.get("/", playlist_Controller.index);
router.get('/:id', playlist_Controller.getOnePlaylist);

router.post('/add', playlist_Controller.addNewPlayList);

router.delete('/delete/:id', playlist_Controller.removePlayList);

router.put('/:id/update', playlist_Controller.updatePlayList);

module.exports = router;