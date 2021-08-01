
const chat = require("../models/chat");
let path = require("path");

let mongoose = require("mongoose");
let formidable = require("formidable")
const e = require("express");


class Chat {
    async index(req, res) {

        let { idRoom } = req.query;
        let condittion = {};
        if (idRoom) {
            condittion = {
                ...condittion,
                idRoom: mongoose.Types.ObjectId(idRoom)
            }
        }
        let listChat = await chat.find(condittion)
        // console.log(listChat)
        res.json({
            status: "successfully",
            data: listChat ? listChat : []
        })
    }
}
module.exports = new Chat