import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Container, Table, Row, Col } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import refreshToken from '../../util/refreshToken';
import'./style.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'




//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









const ArtistViewModal = ({ show, onClose, artist, currentUser }) => {

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }

    const[addBtn, setAddBtn] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('createdPlaylist')) {
            setAddBtn(true)
        }
    }, [])


//CONTROLLO IL TOKEN________________________________________________________________________________________________________________

 const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//GET TOP 5 ARTIST TRACKS_________________________________________________________________________________________________________

const [tracks, setTracks] = useState()

    useEffect(() => {
        const country = currentUser.country
        spotifyApi.getArtistTopTracks(artist.id, country)
        .then(res => {
            console.log(res)
            const tracce = res.body.tracks.map((trackInfo => {
                const duration = new Date(trackInfo.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
                return {
                    id: trackInfo.id,
                    artists: trackInfo.artists.join(', '),
                    duration: duration,
                    name: trackInfo.name,
                    uri: trackInfo.uri,
                    index: trackInfo.track_number
                }
            }))
            setTracks(tracce)
        })
        .catch(e => {
            console.log( e);
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })

    }, [])


//______________________________________________________________________________________________________________________________



    

    return (
        <Modal show={show} size="xl" centered>

            <Modal.Header className='bg-dark'>
                
                <Container className='d-flex' >
                <div className='immagineArtista' style={{ backgroundImage: `url(${artist.image})` }}></div>
                <div className='text'>  
                    <div className='text-light '><h1 >{artist.name}</h1></div>
                    <div className='text-light '><i >{artist.genres.join(', ')}</i></div>
                    <div className='text-light followersArtista '>{"Followers: "+artist.followers}</div>
                </div>
            </Container>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                <div>
                    <Table hover variant="dark">

                        {tracks ? 
                            tracks.map((track, index) =>(
                            <tr>
                                <td> {track.duration}</td>
                                <td>{track.name}</td>
                                <td> {track.artist}</td>
                                <td className='text-center'> <b >{index+1}</b></td>
                                {addBtn&&<td><Button className='btn-success' onClick={addTrack(track)}>+</Button></td>}
                            </tr>
                        )) : null
                        }
                    </Table> 
                </div>
            </Modal.Body>
            <Modal.Footer className='bg-dark justify-content-center'>
                <Button className='btn-light' onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )


    

    function addTrack(currentTrack){
        const currentPlaylist = JSON.parse(localStorage.getItem("createdPlaylist"))
        if (currentPlaylist) {
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
    }
}

export default ArtistViewModal