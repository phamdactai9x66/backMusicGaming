const topic = require("../models/topic");
const mongoose = require("mongoose")
let { statusS, statusF } = require("../validator/methodCommon")



class topics {
    async index(req, res, next) {
        let { _page, _limit, name, id } = req.query;
        await topic.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, response) => {
                if (err || !response) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We have some error :${err}`
                    })
                } else {
                    if (name) {
                        let findName = response.filter(currenT => {
                            let nameTopic = currenT.name.toLocaleLowerCase();
                            let ParamsName = name.toLocaleLowerCase();

                            return nameTopic.indexOf(ParamsName) != -1;
                        })
                        return res.json({
                            status: statusS,
                            data: findName,
                            message: "get data successfully"
                        })
                    } else if (id) {
                        let findId = response.find(currenT => currenT._id == id);
                        return res.json({
                            status: statusS,
                            data: findId,
                            message: "get data successfully"
                        })
                    }
                    res.json({
                        status: statusS,
                        data: response,
                        message: "get data successfully"
                    })
                }
            });
    }
    async getOne(req, res) {
        let { idTopic } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idTopic)
        }
        await topic.findById(condition).exec((error, response) => {
            if (error || !response) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `We have some error: ${error}`
                })
            } else {
                res.json({
                    status: statusS,
                    data: [response],
                    message: ``
                })
            }
        })
    }
}
module.exports = new topics;