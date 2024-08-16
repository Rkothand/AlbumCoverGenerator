// index.js
const getAccessToken = require('./auth');
const { getAlbumsFromPlaylist, sortAlbumsByTrackCount, downloadAlbumCovers } = require('./albums');
const { playlistId } = require('./config');

(async () => {
  try {
    const accessToken = await getAccessToken();
    const albums = await getAlbumsFromPlaylist(playlistId, accessToken);
    const sortedAlbums = sortAlbumsByTrackCount(albums);
    const albumCovers = await downloadAlbumCovers(sortedAlbums,limit = 49);
    // Print sorted albums
    for (const album of sortedAlbums.slice(0, 49)) {
      console.log(`Album: ${album.name}, Track Count: ${album.count}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
