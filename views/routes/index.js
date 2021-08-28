
const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
function routes(app) {
      app.use("/songCate", songCate)
      app.use("/topic", topic)
      app.use('/', side)


}
module.exports = routes;