var express = require('express')

var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "this is test get userPlaylist"
    })
});
// router.get('/:idAlbum', .getOne);

// router.post('/add', .createAlbum);

// router.delete('/:idAlbum/delete', .deleteAlbum);

// router.put('/:idAlbum/update', .editAlbum)


module.exports = router;