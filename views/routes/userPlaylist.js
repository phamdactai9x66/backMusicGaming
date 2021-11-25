var express = require('express')

var router = express.Router();
const userPlaylistController = require('../app/controllers/userPlaylistController');
const { checkLogin, checkAuthe } = require('../app/validator/methodCommon');

router.get('/', checkLogin, checkAuthe(), userPlaylistController.index);// api này lấy toàn bộ thông tin userplaylist của tất cả user nên cần phải có quyền admin
router.get('/:idUserPlaylist', checkLogin, userPlaylistController.getOne);

router.post('/add', checkLogin, checkAuthe(), userPlaylistController.createUserPlaylist);

router.delete('/:idUserPlaylist/delete', checkLogin, checkAuthe(), userPlaylistController.deleteUserPlaylist);

router.put('/:idUserPlaylist/update', checkLogin, checkAuthe(), userPlaylistController.editUserPlaylist)


module.exports = router;