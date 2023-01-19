import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, ModalHeader, Pagination, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import refreshToken from '../../util/refreshToken';
import'./style.css'
import { PlusCircle } from 'react-bootstrap-icons';
import playlistImage from '../../assets/generalPlaylistImage.jpg'

const spotifyApi = new SpotifyWebApi({
    clientId: '61e53419c8a547eabe2729e093b43ae4'
});

const ModalPlaylistDetail = ({ show, onClose, playlist }) => {

    const [image, setImage] = useState(playlistImage);
    useEffect(() => {
        if (playlist.image) {
            setImage(playlist.image)
        }
        }, [])


 const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//PAGINAZIONE________________________________________________________________________________________________________________________

    const [page, setPage] = useState({
        data: [],
        limit: 10,
        activePage: 1,
        totalPages: 0
    })


    useEffect(() => {
        spotifyApi.getPlaylistTracks(playlist.id, { limit: page.limit, offset: (page.activePage - 1)*page.limit })
        .then(res => {
            console.log(res)
            const totalPages = Math.ceil(res.body.total / page.limit);
            const tracks = res.body.items.map((trackInfo => {
                console.log(trackInfo)
                const artist = trackInfo.track.artists === []
                    ? 'Unkonown'
                    : trackInfo.track.artists.reduce((prev, artist) => {    //reduce funzione che concatena gli elementi, ad ogni giro aggiungo un artist a prev ==> unica stringa di artisti
                        return prev.concat(artist.name + '')
                    }, '');
                const duration = new Date(trackInfo.track.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
                return {
                    id: trackInfo.track.id,
                    artist: artist,
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
            console.log(err)
            refreshToken();
        })

    }, [page.activePage])



    const handlePageChange = (pageNumber) => {
        setPage(prev => ({
            ...prev,
            activePage: pageNumber
        }))
    }
    
//REMOVE TRACK_______________________________________________________________________________________________________________________
function removeTrack(trackUri){
    spotifyApi.removeTracksFromPlaylist(playlist.id, [{uri: trackUri}])
    .then({
        
    })
    .catch(err => {
        console.log(err)
        refreshToken();
    })
}

//______________________________________________________________________________________________________________________________


    const currentUser = JSON.parse(localStorage.getItem('user'));

    return (
        <Modal show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="header d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="img" src={image} />
                    <Card.Body>
                        <Card.Title> {playlist.name} </Card.Title>
                        <Card.Text> {playlist.ownerName} </Card.Text>
                        {playlist.description && <p>{playlist.description}</p>}
                        {/* tags.... */}
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
                                        <td> {item.artist}</td>
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