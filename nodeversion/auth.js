// auth.js
const axios = require('axios');
const { clientId, clientSecret } = require('./config');

// Encode credentials for Basic Auth
const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Function to get access token from Spotify
async function getAccessToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response.data);
    throw error;
  }
}

module.exports = getAccessToken;
