var express = require('express')

var router = express.Router();
const userPlaylistController = require('../app/controllers/userPlaylistController');

router.get('/', userPlaylistController.index);
router.get('/:idUserPlaylist', userPlaylistController.getOne);

router.post('/add', userPlaylistController.createUserPlaylist);

router.delete('/:idUserPlaylist/delete', userPlaylistController.deleteUserPlaylist);

router.put('/:idUserPlaylist/update', userPlaylistController.editUserPlaylist)


module.exports = router;