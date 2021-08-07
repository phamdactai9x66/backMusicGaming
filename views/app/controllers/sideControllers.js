const category = require("../models/category");



class sides {
    async index(req, res, next) {
        res.json({
            status: "xin chao"
        })
    }
}
module.exports = new sides;