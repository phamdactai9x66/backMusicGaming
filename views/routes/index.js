
const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
const playlist = require("./playlist");
const song = require("./song");
function routes(app) {

      app.use("/song", song)
      app.use("/playlist", playlist)
      app.use("/songCate", songCate)
      app.use("/topic", topic)
      app.use('/', side)
}
module.exports = routes;