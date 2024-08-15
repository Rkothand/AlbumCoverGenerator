// config.js



// Function to extract the playlist ID from a Spotify URL
function getPlaylistIdFromUrl(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Extract the playlist ID from the URL
const PLAYLIST_ID = getPlaylistIdFromUrl(PLAYLIST_URL);

if (!PLAYLIST_ID) {
  throw new Error('Invalid playlist URL. Please check the format.');
}

module.exports = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  playlistId: PLAYLIST_ID,
};
