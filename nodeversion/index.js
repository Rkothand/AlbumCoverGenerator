// index.js
const getAccessToken = require('./auth');
const { getAlbumsFromPlaylist, sortAlbumsByTrackCount } = require('./albums');
const { playlistId } = require('./config');

(async () => {
  try {
    const accessToken = await getAccessToken();
    const albums = await getAlbumsFromPlaylist(playlistId, accessToken);
    const sortedAlbums = sortAlbumsByTrackCount(albums);

    // Print sorted albums
    for (const album of sortedAlbums) {
      console.log(`Album: ${album.name}, Track Count: ${album.count}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
