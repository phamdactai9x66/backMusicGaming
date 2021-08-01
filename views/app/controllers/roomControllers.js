
const room = require("../models/room");
let path = require("path");

let mongoose = require("mongoose");
let formidable = require("formidable")
const e = require("express");


async function handlePromise(params) {
    try {
        let data = await params;
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

class Room {
    async index(req, res) {
        let { idRoom } = req.query;
        let condittion = {};
        if (idRoom) {
            condittion = {
                ...condittion,
                idRoom: mongoose.Types.ObjectId(idRoom)
            }
        }
        let listChat = await room.find(condittion)
        res.json({
            status: "successfully",
            data: listChat ? listChat : []
        })
    }
    async newRoom(req, res) {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, all_input, file) => {
            console.log(all_input.nameRoom)
            if (all_input.nameRoom) {
                let data = {
                    nameRoom: all_input.nameRoom
                }
                let addNewRoom = new room(data)
                let [dataRoom, error] = await handlePromise(addNewRoom.save());
                if (error) {
                    return res.json({
                        status: 'failed',
                        message: "Add new Room been failed.",
                        error
                    })
                }

                return res.json({
                    status: 'successfully',
                    message: "Add new Room been successfully",
                    data: dataRoom
                })
            }

            return res.json({
                status: 'failed',
                message: "We don't allow input empty."
            })

        })

    }
}
module.exports = new Room