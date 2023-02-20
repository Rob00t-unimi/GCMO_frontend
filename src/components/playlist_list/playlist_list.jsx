import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import {Col, Button } from "react-bootstrap";
import './style.css';
import ErrorStatusCheck from "../../util/errorStatusCheck";
import { spotifyApi } from '../../util/costanti';


function Playlist_list({showFooter, setShowFooter}){

//ESTRAGGO LA LISTA DI PLAYLIST________________________________________________________________________________________________________________________________________________________________________________________________________________
    const [lista, setLista] = useState(null)

    useEffect(() => {
        let createdPlaylist = JSON.parse(localStorage.getItem('createdPlaylist'))
        let playlist_list = JSON.parse(localStorage.getItem('playlist_list'))

        if(playlist_list&&createdPlaylist&&!playlist_list.some(playlist => playlist.id === createdPlaylist.id)) {
            const list = [createdPlaylist].concat(playlist_list);
            setLista(list)
        } else if(localStorage.getItem('playlist_list')) {
            setLista((JSON.parse(localStorage.getItem('playlist_list'))))
        }
    }, [])

//INSERISCE la playlist e le sue tracce nel local storage_______________________________________________________________________________________________________________

    function addPlaylistInStorage(playlist){
        if(!showFooter) {
            spotifyApi.getPlaylistTracks(playlist.id)
            .then((tracks) => {
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

    //___________________________________________________________________________________________________________________________________________________________________

    return(
        lista ? 
        <Col className="colonna-sx-navigationPage bg-dark">
            <hr className="text-light"></hr>
            <h2 className="myPlaylistList text-light">My Playlists</h2>
            <p className="text-light text-center">Premi su una playlist per aggiungere i brani</p>
            <hr className="text-light"></hr>
            <div className="tabellaPlaylistList" variant="dark">
                {lista.map((playlist, index) => (
                    <div key={index}><Button className="playlistListElements btn-dark" onClick={()=>addPlaylistInStorage(playlist)}>{playlist.name}<hr/></Button></div>
                ))}
            </div>
        </Col> : 
        <Col className="colonna-sx-navigationPage bg-dark"></Col>
    )
}

export default Playlist_list;