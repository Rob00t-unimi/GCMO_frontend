import React, { useEffect, useState } from 'react'
import { Button, Modal, Container, Table} from 'react-bootstrap'
import'./style.css'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';




const ArtistViewModal = ({ show, onClose, artist, currentUser }) => {

  //MANTENGO UNO STATE DELL'ACCESS TOKEN, il setter viene passato alla gestione errori e poi a refreshToken, al cambiare dello state rieseguo alcune funzioni_________________________________________________________
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"))

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }

//GET TOP ARTIST TRACKS_______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

const [tracks, setTracks] = useState()

    useEffect(() => {
        const country = currentUser ? currentUser.country : null
        spotifyApi.getArtistTopTracks(artist.id, country ? country : currentUser.country )
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
            ErrorStatusCheck(err, setAccessToken)
        })

    }, [accessToken])

   

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