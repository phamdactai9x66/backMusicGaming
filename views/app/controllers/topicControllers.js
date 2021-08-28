const topic = require("../models/topic");



class topics {
    async index(req, res, next) {

        let getTopic = await topic.find({}).exec();
        console.log(getTopic)
        res.json({
            status: "this topic"
        })
    }
}
module.exports = new topics;