import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Modal, Col, Table, Row } from 'react-bootstrap'
import'../generalStyle.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import UserModalView from '../userModalView/userModalView';
import TrackCardHorizontal from '../trackCardHorizontal/trackCardHorizontal'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



const ModalPlaylistDetail = ({ show, onClose, playlist, currentUser, showFooter, createdPlaylist, setDeletedTracks, addPlaylist}) => {

  //MANTENGO UNO STATE DELL'ACCESS TOKEN, il setter viene passato alla gestione errori e poi a refreshToken, al cambiare dello state rieseguo alcune funzioni_____________________________________________________________________________________________________
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"))


    const {setToast} = useContext(ToastContext)

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }
    
    const [showImport, setShowImport] = useState (false)

    //RICHIESTA TRACCE___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    
    const [tracks, setTracks] = useState([])
    const [offset, setOffset] = useState(0)

    function getAllTracks() {
        let limit = 50;
    
        spotifyApi.getPlaylistTracks(playlist.id, { offset, limit })
        .then(res=>{
            //console.log(res)
            const tracce = res.body.items.map((trackInfo => {
                    const duration = new Date(trackInfo.track.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
                    return {
                        id: trackInfo.track.id,
                        artists: trackInfo.track.artists.map(artist => artist.name),
                        duration: duration,
                        name: trackInfo.track.name,
                        uri: trackInfo.track.uri,
                        image: trackInfo.track.album.images[0].url,
                        artists: trackInfo.track.artists.map(artist => artist.name),
                        artistsId: trackInfo.track.artists.map(artista => artista.id),
                        releaseDate: trackInfo.track.album.release_date,
                    }
                }))
            const allTracks = tracks.concat(tracce);
        
            setTracks(allTracks)
            //console.log("Elenco Tracce", allTracks)
            
            setOffset(offset + limit);

            if (res.body.next === null) {
                setShowImport(true)
                setOffset(0)
            } 
                
        }) 
        .catch(err => {
            // let retryAfter = err.response.headers['Retry-After'];
            // if (err.body.error&&err.body.error.status === 429 ) {
            //     setTimeout(() => {
            //         getAllTracks()
            //     }, retryAfter);
            // }
            ErrorStatusCheck(err, setAccessToken)
        })
    }

    useEffect(() => {
        getAllTracks()
    }, [accessToken])
  
    
//REMOVE TRACK_______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

function removeTrack(trackUri, i){
    spotifyApi.removeTracksFromPlaylist(playlist.id, [{uri: trackUri}])
    .then( ()=>{
        setTracks(prevTracks => {
            let newTracks = [...prevTracks];
            newTracks[i] = null;
            return newTracks;
        }); 
        setDeletedTracks()
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}

//IMPORTARE IN UNA NUOVA PLAYLIST_____//MAX 50 TRACCE PER I LIMITI DI RICHIESTE ________//se si carica una playlist più grande cliccando ripetutamente show more è possibile anche per playlist con + di 50 tracce________________________________________
async function importaPlaylist(){
    const tracce = tracks.map(track => track.uri)                                        //con una richiesta si possono aggiungere massimo 100 tracce
    try {
        const res = await spotifyApi.createPlaylist(playlist.name, {public: false})
        try {
            for (let inizio = 0; inizio < tracce.length; inizio+=100) {                     //faccio un ciclo per fare più chiamate in caso ci siano più di 100 tracce
                let arrayDaInviare
                if (tracce.length <= 100) {
                    arrayDaInviare = tracce
                } else {
                    if(tracce.length-inizio > 100) {
                        arrayDaInviare = tracce.slice(inizio, inizio+100)
                    } else {
                        arrayDaInviare = tracce.slice(inizio, tracce.lenght)
                    }
                }
                await spotifyApi.addTracksToPlaylist(res.body.id, arrayDaInviare)
            }
            setToast(true, "Playlist importata correttamente.")
           
                spotifyApi.getPlaylist(res.body.id)
                .then(data=>{
                    const newPlaylist = {
                        image: data.body.images && data.body.images.length > 0 ? data.body.images[0].url : null,
                        name: data.body.name,
                        description: data.body.description ? data.body.description : null,
                        id: data.body.id,
                        ownerId: data.body.owner.id,
                        ownerName: data.body.owner.display_name,
                        public: data.body.public,
                        totalTracks: data.body.tracks.total,
                        uri: data.body.uri
                    }
                    if(addPlaylist){
                        addPlaylist(newPlaylist)
                    } else {
                        let lista = [newPlaylist];
                        let lista2 = JSON.parse(localStorage.getItem("playlist_list")) || [];
                        lista = [...lista, ...lista2];
                        console.log("lista", lista);
                        localStorage.setItem("playlist_list", JSON.stringify( lista))
                    }
                })
        } catch (err) {
            setToast(true, "Non è stato possibile importare la Playlist.")
            ErrorStatusCheck(err)
            if(res){
                await spotifyApi.unfollowPlaylist(res.body.id)        //se non è stato possibile importare le tracce elimino la playlist creata
            }
        }     
    } catch (err) {
        setToast(true, "Non è stato possibile importare la Playlist.")
        ErrorStatusCheck(err)
    }
}

//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

const[userModalShow, setUserModalShow] = useState(false)

    return (
        <Modal className='bg-light bg-opacity-25' show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="headerCardModalView d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="imgCardModalView" src={playlist.image?playlist.image:playlistImage} />
                    <Card.Body>
                        <Card.Title > {playlist.name} </Card.Title>
                        <a className='btn btn-dark btnUserName' onClick={()=>setUserModalShow(true)}>{playlist.ownerName}</a>

                        {playlist.description && <p>{playlist.description}</p>}
                        <div className='d-flex'>
                            <div></div>
                            
                            
                            {/* tags....genere... */}
                        </div>
                        
                    </Card.Body>
                </Card>
                <Button className='button btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>

            <Modal.Body className='bg-dark'>
                <div style={{ maxHeight: "65vh", overflowY: "auto", overflowX: "hidden"}}>

                    <Table >
                        <tbody>
                            {tracks&&tracks.map((item, index) => {

                                return (
                                <span>
                                    {(playlist.ownerId === currentUser.id)&&item ? 
                                        <Row>
                                            <Col className='col-11'><TrackCardHorizontal currentTrack={item} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col>
                                            <Col className='col-1'><Button className='btn-danger btn-round btn-m' onClick={() => {removeTrack(item.uri, index)}} style={{ marginTop: "3.2vh"}}>X</Button></Col>
                                        </Row> 
                                    : item ?
                                        <TrackCardHorizontal currentTrack={item} showFooter={showFooter} currentPlaylist={createdPlaylist}/> 
                                    : null
                                    }     
                                </span>
                                );
                            })}
                        </tbody>
                    </Table>
                    {offset!==0&&<div className='text-center'><Button className='btn-dark' onClick={getAllTracks}><u>Show more</u></Button></div>}
                    
                </div>
                {userModalShow&&<UserModalView playlistOwnerId={playlist.ownerId} show={userModalShow} onClose={()=>setUserModalShow(false)} showFooter={showFooter} createdPlaylist={createdPlaylist}></UserModalView>}
            </Modal.Body>
            <Modal.Footer className='bg-dark'>
                <div className='d-flex'>
                {showImport&&tracks.length>0&&<div><Button className='btn-light btnImport' onClick={importaPlaylist}>Importa in nuova playlist</Button></div>}
                <a className="spotifyLinkBtn btn btn-success btn-sm" href={playlist.uri} target="_blank" ><img src={spotifyLogo} /></a>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalPlaylistDetail




