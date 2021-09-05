var express = require('express')

var router = express.Router()

const album_Controller = require("../app/controllers/albumController");

router.get('/', album_Controller.index);
router.get('/:idAlbum', album_Controller.getOne);
// router.get('/:idArtist/artist', album_Controller.getAlbumByArtist)

router.post('/add', album_Controller.createAlbum);

router.delete('/:idAlbum/delete', album_Controller.deleteAlbum);

router.put('/:idAlbum/update', album_Controller.editAlbum)


module.exports = router;