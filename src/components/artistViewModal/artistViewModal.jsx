import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Modal, Container, Table, Row, Col } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'./style.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



const ArtistViewModal = ({ show, onClose, artist, currentUser }) => {

    const {setToast} = useContext(ToastContext)

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
        const country = currentUser ? currentUser.country : null
        spotifyApi.getArtistTopTracks(artist.id, country ? country : "IT" )
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
        .catch(err => {
            ErrorStatusCheck(err)
        })

    }, [])



//______________________________________________________________________________________________________________________________

function addTrack(currentTrack){
    const currentPlaylist = JSON.parse(localStorage.getItem("createdPlaylist"))
    if (currentPlaylist) {
        spotifyApi.addTracksToPlaylist(currentPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)
        setAddBtn(false)
        setToast(true, "Traccia aggiunta correttamente")
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
    }
}


    

    return (
        <Modal show={show} animation={true} size="xl" centered>
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
                    <h4 className='text-light text-center'>Top 10 {artist.name}'s tracks</h4>
                    <hr className='text-light'></hr>
                    <Table hover variant="dark">

                        {tracks ? 
                            tracks.map((track, index) =>(
                            <tr>
                                <td className='text-center'> <b>{index+1}</b></td>
                                <td>{track.name}</td>
                                <td> {track.artist}</td>
                                <td>{track.duration} </td>
                                {addBtn&&<td><Button className='btn-success' onClick={addTrack(track)}>Add</Button></td>}
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

}

export default ArtistViewModal