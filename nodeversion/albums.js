const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const albumCoverDir = path.resolve(__dirname, 'album_covers');
const albumDataPath = path.resolve(__dirname, 'albums.json');

// Function to retrieve albums from a Spotify playlist
async function getAlbumsFromPlaylist(playlistId, accessToken) {
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
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
        const albumImage = album.images[0]?.url || null; // Get the URL of the album cover image

        // Increment the count of tracks for each album
        if (!albums[albumId]) {
          albums[albumId] = {
            name: albumName,
            image: albumImage,
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

// Function to sort albums alphabetically
function sortAlbumsAlphabetically(albums) {
  const sortedAlbums = Object.entries(albums)
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return sortedAlbums;
}

function sanitizeFilename(name) {
  // Replace any characters not allowed in filenames with an underscore
  return name.replace(/[/\\?%*:|"<>]/g, '_');
}

// Function to download album cover images
async function downloadAlbumCovers(albums, limit) {
  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(albumCoverDir)) {
      fs.mkdirSync(albumCoverDir);
    }
  } catch (error) {
    console.error('Error creating album cover directory:', error);
    throw error;
  }

  // Limit the number of albums to download
  albums = albums.slice(0, limit);

  // Download each album cover image
  for (const album of albums) {
    const albumId = album.id;
    const albumName = album.name;
    const albumImage = album.image;
    const sanitizedAlbumName = sanitizeFilename(albumName);
    if (albumImage) {
      // const filename = path.join(albumCoverDir, `${albumId}.jpg`);
      const filename = path.join(albumCoverDir, `${sanitizedAlbumName}.jpg`);
      try {
        const response = await fetch(albumImage);
        const buffer = await response.buffer();
        fs.writeFileSync(filename, buffer);
        console.log(`Downloaded album cover for ${albumName}`);
      } catch (error) {
        console.error(`Error downloading album cover for ${albumName}:`, error);
      }
    }
  }
}

// Function to save albums as JSON
function saveAlbumsAsJson(albums) {
  try {
    fs.writeFileSync(albumDataPath, JSON.stringify(albums, null, 2));
    console.log('Album data saved to albums.json');
  } catch (error) {
    console.error('Error saving album data:', error);
  }
}

module.exports = {
  getAlbumsFromPlaylist,
  sortAlbumsByTrackCount,
  downloadAlbumCovers,
  saveAlbumsAsJson,
  sortAlbumsAlphabetically
};
