import React from "react";
import {Card, Button, Col} from 'react-bootstrap'
import '../general.css'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import { HeartFill, Heart, Plus} from 'react-bootstrap-icons';
import TrackViewModal from "../trackViewModal/trackViewModal";
import ErrorStatusCheck from '../../util/errorStatusCheck'

//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc'//'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function TrackCardHorizontal({currentTrack, showFooter}){

    


    
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
//se la createdPlaylist non è nel local storage showFooter sarà false e non renderizzo il Btn
//se showFooter è true ma la traccia è già presente nella playlist non renderizzo il Btn 
const [addBtn, setAddBtn] = useState()

useEffect(() => {

    const traccePlaylist = JSON.parse(localStorage.getItem('createdPlaylistTracks'))
    let trackIsJustContained = false

    if(!traccePlaylist||traccePlaylist.length===0) {
        setAddBtn(showFooter)
        return
    }

    
    for(let i=0; i<traccePlaylist.length; i++) {
        if (traccePlaylist[i]===currentTrack.id) {
            trackIsJustContained = true
        }
    }

    if (trackIsJustContained) {
        setAddBtn(false)
    } else {
        setAddBtn(showFooter)
    }

}, [showFooter] )


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
                    <div className='card-body d-flex'>
                        <Col>
                            <Card.Title>{currentTrack.name}</Card.Title>
                            <Card.Text>{currentTrack.artists.join(', ')}</Card.Text>
                        </Col>
                        
                        <Col>
                            <div className="text-center" style={{marginLeft: "3rem"}} >Release date: {currentTrack.releaseDate}</div>
                        </Col>
                    </div>
            </div>
                <Col className="d-flex">
                    <Col>
                        {addBtn&&<div className="d-flex"><Button className="buttonCardOrizzontale btn-success" onClick={addTrack}><Plus></Plus></Button></div>}
                        {!addBtn&&<div className="buttonCardOrizzontale" style={{width: "44px"}}/>}
                    </Col>
                    <Col>
                        {type  ? 
                            <div className=' d-flex'>
                                <Button className='buttonCardOrizzontale ' onClick={switchFollow}><HeartFill/></Button> 
                            </div> :
                            <div className=' d-flex'>
                                <Button className='buttonCardOrizzontale' onClick={switchFollow}><Heart/></Button>
                            </div>
                        }
                    </Col>
                </Col>
                {show&&<TrackViewModal show={show} onClose={()=>setShow(false)} currentTrack={currentTrack}></TrackViewModal>}
        </Card>
    )
}

export default TrackCardHorizontal