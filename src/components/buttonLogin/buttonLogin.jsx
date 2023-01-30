import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import useAuth from '../../util/useAuth';
import spotifyLogo from '../../assets/SpotifyLogo02.png'
import { CLIENT_ID } from '../../util/costanti';

//INIZIALIZZO LE COSTANTI_______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

const BASE_URL = "https://accounts.spotify.com/authorize";

const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:3000/';
const SPOTIFY_SCOPE = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-modify-playback-state%20user-follow-modify%20user-follow-read%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20ugc-image-upload%20user-top-read';

const AUTH_URL = `${BASE_URL}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPE}`;

//______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

function ButtonLogin(props) {

    const codeParam = new URLSearchParams(window.location.search).get("code")


    if (localStorage.getItem('accessToken')) {      //se sono loggato mando alla personal area
        window.location= '/personalArea'
    }

    console.log('codeParam', codeParam)             //se non lo sono avvio la funzione useAuth passandogli il code ottenuto
    const accessToken = useAuth(codeParam);
    

    return (
        <a className="btn btn-dark btn-lg" href={AUTH_URL}>{props.text}<img className="spotifyLogo" src={spotifyLogo} alt="Spotify Logo"/></a>      //il code è ottenuto dal click sul pulsante, il click ci rimanda all'url AUTH_URL per accettare gli scopes e ci rimanda indietro con il code nell'URL di ritorno
    )

}

export default ButtonLogin;
