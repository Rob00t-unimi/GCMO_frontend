import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import './style.css';
import SpotifyWebApi from "spotify-web-api-node";
import ErrorStatusCheck from "../../util/errorStatusCheck";


    //INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
    const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});




function Playlist_list({lista, showFooter, setShowFooter}){

    //CONTROLLO IL TOKEN e lo passo all'oggetto spotifyApi____________________________________________________________________________________
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    }, [accessToken])


//al click inserisco la playlist e le sue tracce nel local storage
    function addPlaylistInStorage(playlist){
        if(!showFooter) {
            spotifyApi.getPlaylistTracks(playlist.id)
            .then((tracks) => {
                console.log(tracks)
                const tracce = tracks.body.items.map(traccia=>{
                    return traccia.track.id
                })
            localStorage.setItem('createdPlaylistTracks', JSON.stringify(tracce))
            localStorage.setItem("createdPlaylist", JSON.stringify(playlist))
            setShowFooter()
            })
            .catch(e=>{
                ErrorStatusCheck()
            })
        }  
    }

    return(
        <Col className="colonna-sx-navigationPage bg-dark">
            <hr className="text-light"></hr>
            <h2 className="myPlaylistList text-light">My Playlists</h2>
            <p className="text-light text-center">Premi su una playlist per aggiungere i brani</p>
            <hr className="text-light"></hr>
            <div className="tabellaPlaylistList" striped bordered hover variant="dark">
                {lista.map((playlist, index) => (
                    <div key={index}><Button className="playlistListElements btn-dark" onClick={()=>addPlaylistInStorage(playlist)}>{playlist.name}<hr/></Button></div>
                ))}
            </div>
        </Col>
    )
}

export default Playlist_list;