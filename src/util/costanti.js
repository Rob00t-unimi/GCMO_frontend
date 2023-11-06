import SpotifyWebApi from "spotify-web-api-node";

export const CLIENT_ID = process.env.CLIENT_ID 

export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});

