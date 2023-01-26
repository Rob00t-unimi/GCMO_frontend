import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Pagination, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'../general.css'
import'./style.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"


//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








const AlbumViewModal = ({ show, onClose, album, currentUser, showFooter }) => {

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
        .catch(err => {
            ErrorStatusCheck(err)
        })

    }, [page.activePage])



    const handlePageChange = (pageNumber) => {
        setPage(prev => ({
            ...prev,
            activePage: pageNumber
        }))
    }
    

//RICERCA GENERI_______________________________________________________________________________________________________________

const [artistGenres, setArtistGenres] = useState()

useEffect(() => {

    spotifyApi.getArtists([album.artistId])                         //ricerca artisti
    .then(res=> {
        const generi = res.body.artists.map(artista => {                                       
            return {
              genres: artista.genres.map(item => item)              //estrapolazione generi
            }
          }) 
          console.log(generi)
        const stringaGeneri = generi.map(stringaGenere=>{           
            return stringaGenere.genres.join(', ')                  //metto i generi in un unica stringa
        })
        setArtistGenres(stringaGeneri)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}, [])





//AGGIUNGERE TRACCIA A PLAYLIST SELEZIONATA_________________________________________________________________________________
//se la createdPlaylist non è nel local storage showFooter sarà false e non renderizzo il Btn
//se showFooter è true ma la traccia è già presente nella playlist non renderizzo il Btn 

const [addBtn, setAddBtn] = useState()
const [tracceAlbum, setTracceAlbum] = useState([])

useEffect(() => {
    if(localStorage.getItem('createdPlaylistTracks')) {
            setTracceAlbum(JSON.parse(localStorage.getItem('createdPlaylistTracks')))
    }
    
    const newAddbtn = page.data.map((item, index) => {
        return showFooter
    })
    setAddBtn(newAddbtn)

}, [showFooter] )


function addTrack(currentTrack, i){
    const currentPlaylist = JSON.parse(localStorage.getItem("createdPlaylist"))
    spotifyApi.addTracksToPlaylist(currentPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)

        const newAddbtn = page.data.map((item, index) => {
            if(i===index){
                return false
            } else {
                return addBtn[index]
            }
        })
        setAddBtn(newAddbtn)

        alert("Playlist aggiunta correttamente")
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
                    <Card.Img className="imgCardModalView" src={album.image?album.image:playlistImage} />
                    <Card.Body>
                        <Card.Title> {album.name} </Card.Title>
                        <div>{album.artists.join(', ')}</div>
                        <div className='d-flex infoModalView'>
                            <div>
                                <div>Release date: {album.releaseDate}</div>
                                {artistGenres&&<div>Generi: <i>{artistGenres.join(', ')}</i></div>}
                            </div>
                            <a className="spotifyLinkBtn btn btn-success btn-sm" href={album.uri} target="_blank" ><img src={spotifyLogo} /></a>
                        </div>
                    </Card.Body>
                </Card>
                <Button className='btnCloseModal btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>

            <Modal.Body className='bg-dark'>
                <div>

                    <Table hover variant="dark">
                        <tbody>
                            {page.data.map((item, index) => {

                                return (
                                    <tr key={item.id} >
                                        <td> {item.duration}</td>
                                        <td>{item.name}</td>
                                        <td> {item.artists.join(', ')}</td>
                                        {(!tracceAlbum.includes(item.id))&&addBtn[index]&&<td><Button className='btn-success' onClick={() => {addTrack(item, index)}}>+</Button></td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    
                </div>

            </Modal.Body>
            <Modal.Footer className='bg-dark justify-content-center'>
                <Pagination>
                    {Array.from({ length: page.totalPages }, (_, index) => (                
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