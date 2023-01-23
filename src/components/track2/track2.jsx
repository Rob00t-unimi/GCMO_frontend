import React from "react";
import {Card, Button} from 'react-bootstrap'
import './style.css'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import refreshToken from '../../util/refreshToken'
import { Heart, HeartFill, Plus, ArrowLeftShort} from 'react-bootstrap-icons';


//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4' //238334b666894f049d233d6c1bb3c3fc
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
        .catch((e)=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    }, [currentTrack])


//INVERTE IL TIPO DELLA PLAYLIST__________________________________________________________________________________________________

function switchFollow(){
    if (type) {
        //chiamata per smettere di seguire     
        spotifyApi.addToMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(false)
        })
        .catch(e=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    } else {
        //chiamata per seguire 
        spotifyApi.removeFromMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(true)
        })
        .catch(e=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
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
    .catch(e=>{
        if (e.response.status === 401 || e.response.status === 403) {
            refreshToken()
        }
    })
}


//___________________________________________________________________________________________________________________________

    return(
        <Card className='cardTraccia bg-dark text-light' >
            
                    <Card.Img src={currentTrack.image}/>
                    <div className="numberTop"><h3>{currentTrack.index}</h3></div>
                    <Card.Body>
                        <Card.Title>{currentTrack.name}</Card.Title>
                        <Card.Text>{currentTrack.artists.join(', ')}</Card.Text>
                        {/* <Card.Text>{currentTrack.genres.join(', ')}</Card.Text> */}
                    </Card.Body>
                <Card.Text >
                {addBtn&&<div className="d-flex actionDiv"><Button className="action btn-success" onClick={addTrack}><Plus></Plus></Button></div>}
                {type  ? 
                    <div className=' d-flex actionDiv'>
                        <Button className='action ' onClick={switchFollow}><HeartFill/></Button> 
                    </div> :
                    <div className=' d-flex actionDiv'>
                        <Button className='action' onClick={switchFollow}><Heart/></Button>
                    </div>
                }
                </Card.Text>
        </Card>
    )
}

export default Track