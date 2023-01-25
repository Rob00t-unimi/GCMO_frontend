import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import './style.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import AlbumViewModal from '../albumViewModal/albumViewModal';
import ErrorStatusCheck from '../../util/errorStatusCheck'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









export default function Album({currentAlbum}){

//INIZIALIZZO DEGLI STATI__________________________________________________________________________________________________________

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken');

//CONTROLLO IL TOKEN_______________________________________________________________________________________________________________

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    


    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

    const [modalModifyShow, setModalModifyShow] = useState(false);


//controllo che tipo di album è  (salvato o no)______________________________________________________________
useEffect(() => {

    spotifyApi.containsMySavedAlbums([currentAlbum.id])
    .then(res =>{
        console.log('risposta', res)
        setType(res.body[0])
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}, [currentAlbum])


//INVERTE IL TIPO DELL'ALBUM________________________________________________________________________________________________________________________
function switchFollow(){
    if (type) {
        //chiamata per smettere di seguire     
        spotifyApi.addToMySavedAlbums([currentAlbum.id])
        .then(res=>{
            setType(false)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    } else {
        //chiamata per seguire 
        spotifyApi.removeFromMySavedTracks([currentAlbum.id])
        .then(res=>{
            setType(true)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }
}

//RENDERING_______________________________________________________________________________________________________________________________________

    return(
        <>
            <Card className='card d-flex flex-row bg-dark text-light' >
                <div className='btn btn-dark d-flex flex-row text-light text-start' onClick={() => { setModalShow(true) }}>
                    <Card.Img className='cardImg' src={currentAlbum.image ? currentAlbum.image : playlistImage}/>
                    <Card.Body>
                        <Card.Title>{currentAlbum.name}</Card.Title>
                        <Card.Text>{currentAlbum.artists.join(', ')}</Card.Text>
                    </Card.Body>
                </div>
                <Card.Text>
                    { 
                    type === 'FOLLOWED' ? 
                                <div className='d-flex'>
                                    <Button className='action ' onClick={switchFollow}><StarFill/></Button> 
                                </div> :
                                <div className='d-flex'>
                                    <Button className='action' onClick={switchFollow}><Star/></Button>
                                </div>
                    }
                </Card.Text>
            </Card>
            
            <AlbumViewModal show={modalShow} album={currentAlbum} onClose={() => { setModalShow(false) }} />

        </>
    )
}