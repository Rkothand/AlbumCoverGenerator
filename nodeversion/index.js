// index.js
const getAccessToken = require('./auth');
const { getAlbumsFromPlaylist, sortAlbumsByTrackCount, downloadAlbumCovers, saveAlbumsAsJson, sortAlbumsAlphabetically } = require('./albums');
const { playlistId } = require('./config');

(async () => {
  try {
    const accessToken = await getAccessToken();
    const albums = await getAlbumsFromPlaylist(playlistId, accessToken);
    const sortedAlbums = sortAlbumsByTrackCount(albums);
    const alphsortedtop = sortAlbumsAlphabetically(sortedAlbums.slice(0,170));
    const albumCovers = await downloadAlbumCovers(sortedAlbums,limit = 170);
    // Print sorted albums
    for (const album of sortedAlbums.slice(0, 170)) {
      console.log(`Album: ${album.name}, Track Count: ${album.count}`);
    }
    saveAlbumsAsJson(sortedAlbums);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
