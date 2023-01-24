import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Pagination, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import refreshToken from '../../util/refreshToken';
import'./style.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'




//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









const AlbumViewModal = ({ show, onClose, album, currentUser }) => {

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

    const [page, setPage] = useState({ data: [], limit: 25, activePage: 1, totalPages: 0 })


    useEffect(() => {
        spotifyApi.getAlbumTracks(album.id, { limit: page.limit, offset: (page.activePage - 1)*page.limit })
        .then(res => {
            const totalPages = Math.ceil(res.body.total / page.limit);
            const tracks = res.body.items.map((trackInfo => {
                const duration = new Date(trackInfo.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
                return {
                    id: trackInfo.id,
                    artists: trackInfo.artists.map(artist => artist.name),  
                    duration: duration,
                    name: trackInfo.name,
                    uri: trackInfo.uri,
                    index: trackInfo.track_number
                }
            }))
            setPage(prev => ({
                ...prev,
                totalPages,
                data: tracks
            }))
            console.log("TRACCE ALBUM", tracks)
        })
        .catch(e => {
            console.log( e.response.status);
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })

    }, [page.activePage])



    const handlePageChange = (pageNumber) => {
        setPage(prev => ({
            ...prev,
            activePage: pageNumber
        }))
    }
    

//______________________________________________________________________________________________________________________________



    

    return (
        <Modal show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="header d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="img" src={album.image?album.image:playlistImage} />
                    <Card.Body>
                        <Card.Title> {album.name} </Card.Title>
                        <Card.Text> {album.ownerName} </Card.Text>
                        <div>{album.artists.join(', ')}</div>
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

export default AlbumViewModal