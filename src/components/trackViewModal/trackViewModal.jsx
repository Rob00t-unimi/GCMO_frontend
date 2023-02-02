import React from "react";
import {Card, Button, Modal} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import "../general.css"
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';



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
        <Modal className="bg-light bg-opacity-25" show={show} animation={true} size="xl" centered>
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
                    </Card.Body>

                </Card>
                <Button className='button btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>
                
            <Modal.Footer className='bg-dark'>
                <a className="spotifyLinkBtn btn btn-success btn-sm" href={currentTrack.uri} target="_blank" ><img src={spotifyLogo} /></a>
            </Modal.Footer>
        </Modal>
    )
}

export default TrackViewModal