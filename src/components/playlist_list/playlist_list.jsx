import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import './style.css';
import SpotifyWebApi from "spotify-web-api-node";
import ErrorStatusCheck from "../../util/errorStatusCheck";
import { spotifyApi } from '../../util/costanti';


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