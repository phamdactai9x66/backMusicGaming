
const side = require("./side");
function routes(app) {

      app.use('/', side)


}
module.exports = routes;