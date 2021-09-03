const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
const playlist = require("./playlist");
const playlistSong = require("./playlistSong");
const song = require("./song");
const slide = require("./slides")

function routes(app) {
  app.use("/playlist", playlist);
  app.use("/songCate", songCate);
  app.use("/topic", topic);
  app.use("/playlistSong", playlistSong);
  app.use("/song", song)
  app.use('/slide', slide)

  app.use("/", side);
}

module.exports = routes;
