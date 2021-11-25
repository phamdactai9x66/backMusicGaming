var express = require('express')

var router = express.Router()

const album_Controller = require("../app/controllers/albumController");
const { checkAuthe, checkLogin } = require('../app/validator/methodCommon');

router.get('/', album_Controller.index);
router.get('/:idAlbum', album_Controller.getOne);
// router.get('/:idArtist/artist', album_Controller.getAlbumByArtist)

router.post('/add', checkLogin, checkAuthe(0), album_Controller.createAlbum);

router.delete('/:idAlbum/delete', checkLogin, checkAuthe(0), album_Controller.deleteAlbum);

router.put('/:idAlbum/update', checkLogin, checkAuthe(0), album_Controller.editAlbum)


module.exports = router;