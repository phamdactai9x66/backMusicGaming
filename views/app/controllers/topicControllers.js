const formidable = require("formidable");
const topic = require("../models/topic");
let path = require('path');



class topics {
    async index(req, res, next) {

        let getTopic = await topic.find({}).exec();
        console.log(getTopic)
        res.json({
            status: "this topic"
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
                    message: "Error 400. Add New Topic"
                })
            }
          
            // check name topic = ''
            if(fields.name === ''){
                return res.json({
                    message: "Name is required."
                })
            }

            if(!files.image){
                return res.json({
                    message: "Image is required>"
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
                        result: topicExisted
                    })
                }

                const uploadFile = files['image'];
                const indexOfPath = uploadFile.path.indexOf('upload')
                const cutPath = uploadFile.path.slice(indexOfPath);
                
                const checkImage = cutPath.split('.')[1];
                if(checkImage === undefined){
                    console.log('true')
                    return res.json({
                        message: "Image is required"
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
                            message: err
                        })
                    }
                    res.json({data})
                })
             
            })
        })
    }
}
module.exports = new topics;