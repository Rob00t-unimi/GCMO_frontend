import React from 'react';
import spotifyLogo from '../../assets/SpotifyLogo02.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import useAuth from '../../util/useAuth';


const BASE_URL = "https://accounts.spotify.com/authorize";
const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:3000/';
const SPOTIFY_SCOPE = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-modify-playback-state%20user-follow-modify%20user-follow-read%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20ugc-image-upload';


const AUTH_URL = `${BASE_URL}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPE}`;

function ButtonLogin(props) {

    const codeParam = new URLSearchParams(window.location.search).get("code")


    if (localStorage.getItem('accessToken')) {
        window.location= '/personalArea'
    }

    console.log('codeParam', codeParam)
    const accessToken = useAuth(codeParam);
    

    return (
        <a className="btn btn-dark btn-lg" href={AUTH_URL}>{props.text}<img className="spotifyLogo" src={spotifyLogo} alt="Spotify Logo"/></a>  
    )

}

export default ButtonLogin;
