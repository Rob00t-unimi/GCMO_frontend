import React from "react";
import {Card, Button} from 'react-bootstrap'
import './style.css'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import { HeartFill, Heart, Plus, ArrowLeftShort} from 'react-bootstrap-icons';
import TrackViewModal from "../trackViewModal/trackViewModal";
import ErrorStatusCheck from '../../util/errorStatusCheck'

//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function Track({currentTrack}){


    
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    const [type, setType] = useState();


//controllo che tipo di traccia è ______________________________________________________________
    useEffect(() => {

        spotifyApi.containsMySavedTracks([currentTrack.id])
        .then(res =>{
            console.log('risposta', res)
            setType(res.body[0])
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
    }, [currentTrack])


//INVERTE IL TIPO DELLA TRACCIA__________________________________________________________________________________________________

function switchFollow(){
    if (type) {
        //chiamata per smettere di seguire     
        spotifyApi.addToMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(false)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    } else {
        //chiamata per seguire 
        spotifyApi.removeFromMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(true)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }
}


//AGGIUNGERE TRACCIA A PLAYLIST SELEZIONATA_________________________________________________________________________________

const [addBtn, setAddBtn] = useState()

useEffect(() => {
  
    if(localStorage.getItem('createdPlaylist')) {
        setAddBtn(true)
    } else {
        setAddBtn(false)
    }
}, [])


function addTrack(){
    const currentPlaylist = JSON.parse(localStorage.getItem("createdPlaylist"))
    spotifyApi.addTracksToPlaylist(currentPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)
        setAddBtn(false)
        alert("Playlist aggiunta correttamente")
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}

const [show, setShow] = useState(false)


//___________________________________________________________________________________________________________________________

    return(
        <Card className='card d-flex flex-row bg-dark text-light' >
            <div className='btn btn-dark text-light text-start d-flex flex-row' onClick={() => { setShow(true) }}>
                    <Card.Img className='cardImg' src={currentTrack.image}/>
                    <Card.Body>
                        <Card.Title>{currentTrack.name}</Card.Title>
                        <Card.Text>{currentTrack.artists.join(', ')}</Card.Text>
                        {/* <Card.Text>{currentTrack.genres.join(', ')}</Card.Text> */}
                    </Card.Body>
            </div>
                <Card.Text className="d-flex flex-row">
                {addBtn&&<div className="d-flex"><Button className="action btn-success" onClick={addTrack}><Plus></Plus></Button></div>}
                {type  ? 
                    <div className=' d-flex'>
                        <Button className='action ' onClick={switchFollow}><HeartFill/></Button> 
                    </div> :
                    <div className=' d-flex'>
                        <Button className='action' onClick={switchFollow}><Heart/></Button>
                    </div>
                }
                </Card.Text>
                {show&&<TrackViewModal show={show} onClose={()=>setShow(false)} currentTrack={currentTrack}></TrackViewModal>}
        </Card>
    )
}

export default Track