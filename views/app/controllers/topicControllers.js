const topic = require("../models/topic");
const mongoose = require("mongoose")
let { statusS, statusF } = require("../validator/methodCommon");
const formidable = require('formidable');
const path = require('path')



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

    addNewTopic(req, res){
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../../public/uploads");
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
            if(err){
                return res.status(400).json({
                    message: "Error 400. Add New Topic",
                    data: [],
                    status: statusF
                })
            }
          
            // check name topic = ''
            if(fields.name === ''){
                return res.json({
                    message: "Name is required.",
                    data: [],
                    status: statusF
                })
            }

            let condition = {
                // name: new RegExp(`${fields.name}`, 'i')
                name: fields.name
            }
            
            topic.findOne(condition).exec((err, topicExisted) => {
                if(err){
                    return res.json({
                        message: "Error: " + err
                    })
                }
                
                if(topicExisted){
                    return res.json({
                        message: `this topic been exist in database`,
                        data: [],
                        status: statusF
                    })
                }

                const uploadFile = files['image'];
                const indexOfPath = uploadFile.path.indexOf('upload')
                const cutPath = uploadFile.path.slice(indexOfPath);
                
                const checkImage = cutPath.split('.')[1];
                if(checkImage === undefined){
                    console.log('true')
                    return res.json({
                        message: "Image is required",
                        data: [],
                        status: statusF
                    })
                }
                
                const data = {
                    ...fields,
                    image: `http://localhost:5000/${cutPath}`
                }
                let createTopic = new topic(data);
                createTopic.save( (err, data) => {
                    if(err){
                        return res.json({
                            message: err,
                            data: [],
                            status: statusF
                        })
                    }
                    res.json({
                        data: data,
                        message: 'add new topic is successfully',
                        status: statusS
                    })
                })
             
            })
        })
    }
}
module.exports = new topics;