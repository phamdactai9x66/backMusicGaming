const modelPlaylist = require("../models/playlist");



class playlist {
    async index(req, res, next) {

        res.json({
            status: "this is playlist"
        })
    }
}
module.exports = new playlist;