import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Pagination, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'../general.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









const ModalPlaylistDetail = ({ show, onClose, playlist, currentUser}) => {

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }


//CONTROLLO IL TOKEN________________________________________________________________________________________________________________

 const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//PAGINAZIONE________________________________________________________________________________________________________________________

const[deletedTrack, setDeletedTrack] = useState(false)

    const [page, setPage] = useState({
        data: [],
        limit: 10,
        activePage: 1,
        totalPages: 0
    })


    useEffect(() => {
        spotifyApi.getPlaylistTracks(playlist.id, { limit: page.limit, offset: (page.activePage - 1)*page.limit })
        .then(res => {
            console.log("dat", res)
            const totalPages = Math.ceil(res.body.total / page.limit);
            const tracks = res.body.items.map((trackInfo => {
                console.log(trackInfo)
                const duration = new Date(trackInfo.track.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
                return {
                    id: trackInfo.track.id,
                    artists: trackInfo.track.artists.map(artist => artist.name),
                    duration: duration,
                    name: trackInfo.track.name,
                    uri: trackInfo.track.uri,
                    index: trackInfo.track.track_number
                }
            }))
            setPage(prev => ({
                ...prev,
                totalPages,
                data: tracks
            }))
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })

    }, [page.activePage, deletedTrack])



    const handlePageChange = (pageNumber) => {
        setPage(prev => ({
            ...prev,
            activePage: pageNumber
        }))
    }
    
//REMOVE TRACK_______________________________________________________________________________________________________________________

function removeTrack(trackUri){
    spotifyApi.removeTracksFromPlaylist(playlist.id, [{uri: trackUri}])
    .then( ()=>{
        setDeletedTrack(!deletedTrack)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}

//______________________________________________________________________________________________________________________________
   

    return (
        <Modal show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="headerCardModalView d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="imgCardModalView" src={playlist.image?playlist.image:playlistImage} />
                    <Card.Body>
                        <Card.Title> {playlist.name} </Card.Title>
                        <Card.Text> {playlist.ownerName} </Card.Text>
                        {playlist.description && <p>{playlist.description}</p>}
                        <div className='d-flex'>
                            <div></div>
                            <a className="spotifyLinkBtn btn btn-success btn-sm" href={playlist.uri} target="_blank" ><img src={spotifyLogo} /></a>
                            
                            {/* tags....genere... */}
                        </div>
                        
                    </Card.Body>
                </Card>
                <Button className='button btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>

            <Modal.Body className='bg-dark'>
                <div>

                    <Table hover variant="dark">
                        <tbody>
                            {page.data.map((item) => {

                                return (
                                    <tr key={item.id} >
                                        <td> {item.duration}</td>
                                        <td>{item.name}</td>
                                        <td> {item.artists.join(', ')}</td>
                                        {(playlist.ownerId === currentUser.id)&&<td><Button className='btn-danger btn-round btn-m' onClick={() => {removeTrack(item.uri)}}>X</Button></td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    
                </div>

            </Modal.Body>
            <Modal.Footer className='bg-dark justify-content-center'>
                <Pagination>
                    {Array.from({ length: page.totalPages }, (_, index) => (                //rivedere
                        <Pagination.Item key={index + 1} active={index + 1 === page.activePage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalPlaylistDetail