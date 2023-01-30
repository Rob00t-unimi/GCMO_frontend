import SpotifyWebApi from "spotify-web-api-node";

//export const CLIENT_ID = '5ee1aac1104b4fd9b47757edf96aba44'
//export const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc'  
export const CLIENT_ID = '1e56ed8e387f449c805e681c3f8e43b4'  
//export const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4'


export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});