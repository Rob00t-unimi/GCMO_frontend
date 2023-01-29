import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Col, Table, Row, Container } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'../general.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import UserModalView from '../userModalView/userModalView';
import TrackCardHorizontal from '../trackCardHorizontal/trackCardHorizontal'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '5ee1aac1104b4fd9b47757edf96aba44'//'238334b666894f049d233d6c1bb3c3fc'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









const ModalPlaylistDetail = ({ show, onClose, playlist, currentUser, showFooter, createdPlaylist}) => {

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }


//CONTROLLO IL TOKEN________________________________________________________________________________________________________________

 const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//________________________________________________________________________________________________________________________

const[deletedTrack, setDeletedTrack] = useState(false)
const [tracks, setTracks] = useState()


async function getAllTracks() {
    let allTracks = []
    let offset = 0;
    let limit = 50;
  
    try {
        while (true) {
            let res = await spotifyApi.getPlaylistTracks(playlist.id, { offset, limit });
            console.log(res)
            const tracks = res.body.items.map((trackInfo => {
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
            allTracks = allTracks.concat(tracks);
        
            if (res.body.next === null) {
                break;
            }
        
            offset += limit;
        }
        console.log(allTracks)
        setTracks(allTracks)
    } catch (err) {
        ErrorStatusCheck(err)
    }
  }

  useEffect(() =>{
    getAllTracks()
  }, [deletedTrack])


    
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


//AGGIUNGERE TRACCIA A PLAYLIST SELEZIONATA_________________________________________________________________________________
//se la createdPlaylist non è nel local storage showFooter sarà false e non renderizzo il Btn
//se showFooter è true ma la traccia è già presente nella playlist non renderizzo il Btn 

const [addBtn, setAddBtn] = useState()
const [traccePlaylist, setTraccePlaylist] = useState([])

useEffect(() => {
    if(!tracks) return
    if(showFooter===null) {return}

    if(localStorage.getItem('createdPlaylistTracks')) {
            setTraccePlaylist(JSON.parse(localStorage.getItem('createdPlaylistTracks')))
    }
    
    const newAddbtn = tracks.map((item, index) => {
        return showFooter
    })
    setAddBtn(newAddbtn)   

}, [showFooter, tracks] )


function addTrack(currentTrack, i){
    if(!tracks) return
    spotifyApi.addTracksToPlaylist(createdPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)

        const newAddbtn = tracks.map((item, index) => {
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
 


//IMPORTARE IN UNA NUOVA PLAYLIST_______________________________________________________________________________________________________
async function importaPlaylist(){
    const tracce = tracks.map(track => track.uri)
    await spotifyApi.createPlaylist(playlist.name, {public: false})
    .then(res=>{

        spotifyApi.addTracksToPlaylist(res.body.id, tracce)
        .then(data => {
            alert("Playlist importata correttamente.")
        })
        .catch(err => {
            alert("Non è stato possibile importare la Playlist.")
            ErrorStatusCheck(err)
            spotifyApi.unfollowPlaylist(res.body.id)
        })
    })
    .catch(err => {
        alert("Non è stato possibile importare la Playlist.")
        ErrorStatusCheck(err)
    })

}

//______________________________________________________________________________________________________________________________
const[userModalShow, setUserModalShow] = useState(false)

    return (
        <Modal className='bg-light bg-opacity-25' show={show} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="headerCardModalView d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="imgCardModalView" src={playlist.image?playlist.image:playlistImage} />
                    <Card.Body>
                        <Card.Title> {playlist.name} </Card.Title>
                        <a className='btn btn-dark' onClick={()=>setUserModalShow(true)}>{playlist.ownerName}</a>

                        {playlist.description && <p>{playlist.description}</p>}
                        <Button className='btn-light' onClick={importaPlaylist}>Importa in nuova playlist</Button>
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
                <div style={{ maxHeight: "65vh", overflowY: "auto", overflowX: "hidden"}}>

                    <Table >
                        <tbody>
                            {tracks&&tracks.map((item, index) => {

                                return (
                                <span>
                                    {(playlist.ownerId === currentUser.id) ? <Row>
                                    <Col className='col-11'><TrackCardHorizontal currentTrack={item} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col>
                                    <Col className='col-1'><Button className='btn-danger btn-round btn-m' onClick={() => {removeTrack(item.uri)}} style={{ marginTop: "3.2vh"}}>X</Button></Col>
                                    </Row> :
                                    <TrackCardHorizontal currentTrack={item} showFooter={showFooter} currentPlaylist={createdPlaylist}/>
                                    }     
                                </span>
                                );
                            })}
                        </tbody>
                    </Table>

                    
                </div>
                {userModalShow&&<UserModalView playlistOwnerId={playlist.ownerId} show={userModalShow} onClose={()=>setUserModalShow(false)} showFooter={showFooter} createdPlaylist={createdPlaylist}></UserModalView>}
            </Modal.Body>
            <Modal.Footer className='bg-dark'>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalPlaylistDetail




