const songCateModel = require("../models/songCate");



class songCate {
    async index(req, res, next) {

        let getSongCateModel = await songCateModel.find({}).exec();
        console.log(getSongCateModel)
        res.json({
            status: "this Song cate"
        })
    }
}
module.exports = new songCate;