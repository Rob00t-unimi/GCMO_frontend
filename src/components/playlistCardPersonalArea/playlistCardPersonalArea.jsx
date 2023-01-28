import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Lock, Unlock, Trash3, Pencil} from 'react-bootstrap-icons';
import '../general.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import ModalDeletePlaylist from '../modalDeletePlaylist/modalDeletePlaylist';
import ModalModifyPlaylist from '../modalModifyPlaylist/modalModifyPlaylist';
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc'//'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









function PlaylistCardPersonalArea({playlist, updatePlaylists, userInfo}){

//INIZIALIZZO DEGLI STATI__________________________________________________________________________________________________________

    const [image, setImage] = useState();

    const accessToken = localStorage.getItem('accessToken');

//CONTROLLO IL TOKEN_______________________________________________________________________________________________________________

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//CONTROLLO IL TIPO DI UNA PLAYLIST__________________________________________________________________________________________________

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalModifyShow, setModalModifyShow] = useState(false);

    //controllo che tipo di playlist è 
    useEffect(() => {
        if (playlist.ownerId !== userInfo.id) {     
            setType('FOLLOWED')
        } else if (playlist.public) {
            setType('PUBLIC')
        } else {
            setType('PRIVATE')
        }       
    }, [playlist])


//IMPOSTO L'IMMAGINE________________________________________________________________________________________________________________

useEffect(() => {
    if (playlist.image) {
        setImage(playlist.image)
    } else {
        setImage(playlistImage)
    }
    }, [playlist])


//INVERTE IL TIPO DELLA PLAYLIST__________________________________________________________________________________________________

    function switchPublic(){
        if (type === 'PUBLIC') {
            spotifyApi.changePlaylistDetails(playlist.id, {public: false})
            .then(data => {
                updatePlaylists()
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
        } else if (type === 'PRIVATE'){
            spotifyApi.changePlaylistDetails(playlist.id, {public: true})
            .then(data => {
                updatePlaylists()
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
        }
    }
    

//UNFOLLOW__________________________________________________________________________________________________

function unfollowPlaylist(){
    if (type === 'FOLLOWED') {
        //chiamata per smettere di seguire      
        spotifyApi.unfollowPlaylist(playlist.id)
        .then(res=>{
            updatePlaylists()
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }
}

//quando chiudo la modale per vidualizzare il contenuto di una playlist, potrei aver cancellato dei brani quindi refresho le playlist
//questo serve poichè una playlist senza una specifica copertina quando viene svuotata spotify rimuove la copertina
useEffect(() => {
    if(!modalShow) {
        updatePlaylists()
    }
}, [modalShow])


//RENDERING_______________________________________________________________________________________________________________________________________

    return(
        <>
            <Card className='card d-flex flex-row bg-dark text-light' >
                <div className='btnCard btn btn-dark d-flex flex-row text-light text-start' onClick={() => { setModalShow(true) }}>
                    <Card.Img className='cardImg' src={image}/>
                    <div className='card-body d-flex'>
                        <Col>            
                            <Card.Title>{playlist.name}</Card.Title>
                            <Card.Text>{playlist.ownerName}</Card.Text>
                        </Col>
                        <Col>
                            <Card.Text className='text-center'>{playlist.totalTracks} Tracce</Card.Text>
                        </Col>
                    </div>
                </div>
                <Col>
                    { 
                    type === 'FOLLOWED' ? 
                                <div className= ' d-flex'>
                                    <div className='buttonCardOrizzontale' style={{width: "44px"}}/> {/*ho aggiunto questo div con la stessa larghezza di uno degli altri btn in modo da avere tutto allineato */}
                                    <Button className='buttonCardOrizzontale btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button>
                                    <Button className='buttonCardOrizzontale' onClick={unfollowPlaylist}><StarFill/></Button>
                                </div> :
                    type === 'PUBLIC' ? 
                                <div className=' d-flex'>
                                    <Button className='buttonCardOrizzontale btn-light' onClick={() => { setModalModifyShow(true) }}><Pencil/></Button>
                                    <Button className='buttonCardOrizzontale btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button> 
                                    <Button className='buttonCardOrizzontale btn-success  ' onClick={switchPublic}><Unlock/></Button> 
                                </div> :

                                <div className=' d-flex'>
                                    <Button className='buttonCardOrizzontale btn-light' onClick={() => { setModalModifyShow(true) }}><Pencil/></Button>
                                    <Button className='buttonCardOrizzontale btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button> 
                                    <Button className='buttonCardOrizzontale btn-danger ' onClick={switchPublic}><Lock/></Button>
                                </div>
                    }
                </Col>
            </Card>
            
            {modalShow&&<PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} currentUser={userInfo} showFooter={null}/>}
            {modalDeleteShow&&<ModalDeletePlaylist show={modalDeleteShow}  onClose={() => {setModalDeleteShow(false)}} playlist={playlist} updatePlaylists={updatePlaylists}/> }
            {modalModifyShow&&<ModalModifyPlaylist show={modalModifyShow} onClose={() => {setModalModifyShow(false)}} playlist={playlist} updatePlaylists={updatePlaylists}/>}
        </>
    )
}

export default PlaylistCardPersonalArea