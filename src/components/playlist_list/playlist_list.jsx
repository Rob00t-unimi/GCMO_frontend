import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import './style.css';


 function Playlist_list({lista, showFooter, setShowFooter}){

    function addPlaylistInStorage(playlist){
        if(!showFooter) {
            localStorage.setItem("createdPlaylist", JSON.stringify(playlist))
            setShowFooter()
        }  
    }

    return(
        <Col className="colonna-sx bg-dark">
            <hr className="text-light"></hr>
            <h2 className="titolo text-light">My Playlists</h2>
            <p className="text-light text-center">Premi su una playlist per aggiungere i brani</p>
            <hr className="text-light"></hr>
            <div className="tabellaPlaylist" striped bordered hover variant="dark">
                {lista.map((playlist, index) => (
                    <div key={index}><Button className="listElements btn-dark" onClick={()=>addPlaylistInStorage(playlist)}>{playlist.name}<hr/></Button></div>
                ))}
            </div>
        </Col>
    )
}

export default Playlist_list;