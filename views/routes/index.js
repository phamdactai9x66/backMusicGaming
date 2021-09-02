const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
const playlist = require("./playlist");
const playlistSong = require("./playlistSong");

function routes(app) {
  app.use("/playlist", playlist);
  app.use("/songCate", songCate);
  app.use("/topic", topic);
  app.use("/", side);
  app.use("/playlistSong", playlistSong);
}
module.exports = routes;
