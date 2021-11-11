const side = require("./side");
const topic = require("./topic");
const songCate = require("./songCate");
const playlist = require("./playlist");
const playlistSong = require("./playlistSong");
const song = require("./song");
const likeSong = require("./likeSong")

const songsArtist = require("./songsArtist")
const slide = require("./slides");
const artist = require("./artist");
const album = require('./album');

const categoryBlog = require('./categoryBlog');
const blog = require('./blog');
const comment = require("./comment")
const detailBlog = require("./detailBlog")

const user = require('./user');
const userPlaylist = require('./userPlaylist');
const songPlaylist = require('./songPlaylist');

const roomSong = require('./roomSong');
const roomUser = require('./roomUser');


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
  app.use('/comment', comment);
  app.use('/detailBlog', detailBlog);
  app.use('/user', user)
  app.use('/userPlaylist', userPlaylist);
  app.use('/songPlaylist', songPlaylist)
  app.use('/likeSong', likeSong);
  app.use('/roomSong', roomSong);
  app.use('/roomUser', roomUser);

  app.use("/", side);
}

module.exports = routes;
