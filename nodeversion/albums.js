// albums.js
const axios = require('axios');

// Function to retrieve albums from a Spotify playlist
async function getAlbumsFromPlaylist(playlistId, accessToken) {
  let url = `https://open.spotify.com/playlist/4EqjTSt4PLBZVcouKBf8hk`;
  let albums = {};

  while (url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          limit: 100
        }
      });

      // Collect album information
      for (const item of response.data.items) {
        const album = item.track.album;
        const albumId = album.id;
        const albumName = album.name;

        // Increment the count of tracks for each album
        if (!albums[albumId]) {
          albums[albumId] = {
            name: albumName,
            count: 0
          };
        }
        albums[albumId].count++;
      }

      // Check for the next page of results
      url = response.data.next;
    } catch (error) {
      console.error('Error fetching albums from playlist:', error.response.data);
      throw error;
    }
  }

  return albums;
}

// Function to sort albums by track count
function sortAlbumsByTrackCount(albums) {
  const sortedAlbums = Object.entries(albums)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, info]) => ({ id, ...info }));

  return sortedAlbums;
}

module.exports = {
  getAlbumsFromPlaylist,
  sortAlbumsByTrackCount
};
