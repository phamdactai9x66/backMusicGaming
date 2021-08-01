const category = require("../models/category");



class sides {
    async index(req, res, next) {
        const { _page, _limit } = req.query;
        let { name } = req.query;

        let getCate = await category.find();

        category.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, cate) => {
                if (err || !cate) {
                    res.json({
                        status: "failed",
                        data: [],
                        message_err: `You have few error: ${err}`
                    })
                } else {
                    if (typeof name == "string") {
                        let savedata = [];
                        if (name) {
                            savedata = getCate.filter((currenValue) => currenValue.name.indexOf(name) != -1)
                            let first = _limit * (_page - 1);

                            let last = (parseInt(_limit)) + first;
                            if (_limit && _page) {
                                return res.json({
                                    status: "successfully",
                                    data: savedata.slice(first, last),
                                })
                            } else {
                                savedata = [...savedata]
                            }
                        } else {
                            savedata = [...cate]
                        }
                        res.json({
                            status: "successfully",
                            data: [...savedata],
                        })
                    } else {
                        res.json({
                            status: "successfully",
                            data: [...cate],
                        })
                    }

                }
            })
    }
}
module.exports = new sides;