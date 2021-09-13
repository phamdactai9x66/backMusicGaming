var express = require('express')

var router = express.Router()

const artist_Controller = require("../app/controllers/artistControllers");

router.post("/add", artist_Controller.createArtist);

router.put("/:idArtist/update", artist_Controller.editArtist);

router.delete("/:idArtist/delete", artist_Controller.deleteArtist)

router.get("/:idArtist", artist_Controller.getOne);

router.get("/", artist_Controller.index);
module.exports = router;