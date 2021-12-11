const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const room = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection theme
    name_Room: {
        type: String, maxLengt: 255, trim: true
    },
    password: { type: String, maxLengt: 255 },
    limit_User: {
        type: Number
    },
    status: {
        type: Boolean,
        default: 0
    },
    id_User: {
        type: Schema.ObjectId
    }
}, {
    timestamps: true
})
room.pre("save", async function name(next) {
    try {
        // if (this.authType != "local") { next() }
        let general_sal = await bcrypt.genSalt(10);

        let passWordHash = await bcrypt.hash(this.password, general_sal);
        this.password = passWordHash
        next();
    } catch (error) {
        next(error);
    }
})
module.exports = mongoose.model("room", room);