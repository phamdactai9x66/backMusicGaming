let passport = require("passport");
let user = require("../models/users");
let passport_facebook = require("passport-facebook").Strategy;
var localStrayegy = require("passport-local").Strategy;
const { check_pass } = require("./method_common");

const id_user_FB = "299090661781554";

const app_secret = "c155ef66cce1bdb02b5576c0a64a985b";

passport.use(new localStrayegy({
    usernameField: "userName",
    passwordField: "passWord"
}, async (userName, passWord, done) => {
    try {
        const find_user = await user.findOne({ userName })

        if (!find_user) { return done(null, false) }

        const check_compar_pass = await check_pass(passWord, find_user.passWord);
        if (check_compar_pass) {
            done("password  match", { ...find_user })
        } else {

            done("password not match", false)
        }
    } catch (error) {
        done("error in server", false)
    }

}))

passport.use(new passport_facebook({
    clientID: id_user_FB,
    clientSecret: app_secret,
    callbackURL: "http://localhost:5000/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async function (accessToken, refreshToken, profile, done) {

        const condition = {
            facebook_id: profile.id,
            authType: "facebook"

        }
        const user1 = await user.findOne(condition)
        console.log(user1)

        if (user1.id) {
            console.log("we have  this account in db");
            done(null, null)
            return;
        }
        const params = {
            facebook_id: profile.id,
            authType: "facebook",
            email: profile.emails[0].value,
            first_name: profile.displayName,
            userName: profile.emails[0].value,
            avatar: profile.photos[0].value,
            address: ""
        }
        const new_user = new user(params);

        let save11 = await new_user.save();

        done(null, null)

    }
));
