const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
const playlist = require("./playlist");
const playlistSong = require("./playlistSong");
const song = require("./song");

const songsArtist = require("./songsArtist")
const slide = require("./slides");
const artist = require("./artist");
const album = require('./album');

const categoryBlog = require('./categoryBlog');
const blog = require('./blog');

const user = require('./user');


function routes(app) {

  app.use("/artist", artist);
  app.use("/playlist", playlist);
  app.use("/songCate", songCate);
  app.use("/topic", topic);
  app.use("/playlistSong", playlistSong);
  app.use("/song", song);
  app.use('/slide', slide);
  app.use('/songsArtist', songsArtist);
  app.use('/categoryBlog', categoryBlog);
  app.use('/blog', blog)
  app.use('/albums', album)
  app.use('/user', user)

  app.use("/", side);
}

module.exports = routes;
