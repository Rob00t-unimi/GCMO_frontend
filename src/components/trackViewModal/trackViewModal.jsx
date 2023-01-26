import React from "react";
import {Card, Button, Modal} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import "../general.css"
import ErrorStatusCheck from '../../util/errorStatusCheck'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________
const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function TrackViewModal({show, onClose, currentTrack}){


    
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

const [artistsGenres, setArtistsGenres] = useState()

//RICERCA GENERI
useEffect(() => {

    spotifyApi.getArtists(currentTrack.artistsId)
    .then(res=> {
        const generi = res.body.artists.map(artista => {                                     //ricerca artisti  
            return {
              genres: artista.genres.map(item => item)
            }
          }) 
          console.log(generi)
        const stringaGeneri = generi.map(stringaGenere=>{
            return stringaGenere.genres.join(', ')
        })
        console.log("stringageneri",stringaGeneri)
        setArtistsGenres(stringaGeneri)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}, [])


//___________________________________________________________________________________________________________________________

    return(
        <Modal show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="headerCardModalView d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="imgCardModalView" src={currentTrack?currentTrack.image:null} />
                    <Card.Body>
                        <Card.Title> {currentTrack.name} </Card.Title>
                        <div>{currentTrack.artists.join(', ')}</div>
                        <div style={{height: "2vh" }}></div>
                
                        <div>Album: {currentTrack.album}</div>
                        <div>Release date: {currentTrack.releaseDate}</div>
                        <div style={{height: "2vh" }}></div>

                        <div style={{width: "43vh" }}>{artistsGenres&&<div>[ {artistsGenres.join(', ')} ]</div>}</div>

                        <a className="spotifyLinkBtn btn btn-success btn-sm" href={currentTrack.uri} target="_blank" ><img src={spotifyLogo} /></a>
                    </Card.Body>

                </Card>
                <Button className='button btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>

            <Modal.Footer className='bg-dark'/>
        </Modal>
    )
}

export default TrackViewModal