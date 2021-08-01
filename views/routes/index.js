
const cate = require("./cate");
const comment = require("./comment");
const image = require("./images");
const chat = require("./chat");
const room = require("./room");
const product = require("./product");
const user = require("./user");
const side = require("./side");
function routes(app) {
      app.use("/room", room)
      app.use('/chat', chat);
      app.use('/image', image);
      app.use('/category', cate);

      app.use('/comment', comment);

      app.use('/product', product);
      app.use('/user', user);
      app.use('/', side)


}
module.exports = routes;