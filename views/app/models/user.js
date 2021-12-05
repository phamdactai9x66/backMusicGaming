const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const slug = require("mongoose-slug-generator")
mongoose.plugin(slug);
const Schema = mongoose.Schema;//generate variable references to mongoose schema

const user = new Schema({//chung ta dang mo ta cai luc do(schema) trong colection theme
    first_name: {
        type: String, maxLengt: 255, trim: true
    },
    last_name: {
        type: String, maxLengt: 255, trim: true
    },
    avatar: { type: String, default: "" },
    gender: { type: Boolean, default: false },
    email: { type: String, unique: true, required: true },
    address: { type: String, default: "" },
    userName: { type: String, unique: true, maxLengt: 255, trim: true, required: true },
    passWord: { type: String, maxLengt: 255, trim: true },
    google_id: {
        type: String,
        default: null
    },
    facebook_id: {
        type: String,
        default: null
    },
    authType: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local"
    },
    role: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    passed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
user.pre("save", async function name(next) {
    try {
        if (this.authType != "local") { next() }
        let general_sal = await bcrypt.genSalt(10);

        let passWordHash = await bcrypt.hash(this.passWord, general_sal);
        this.passWord = passWordHash
        next();
    } catch (error) {
        next(error);
    }
})
module.exports = mongoose.model("user", user);