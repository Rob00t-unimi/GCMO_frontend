import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
//import './style.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
//import ModalDeletePlaylist from '../modalDeletePlaylist/modalDeletePlaylist';
import ModalModifyPlaylist from '../modalModifyPlaylist/modalModifyPlaylist';
import refreshToken from '../../util/refreshToken'
import playlistImage from '../../assets/generalPlaylistImage.jpg'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc' //'61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









function Playlist2({playlist, updatePlaylists}){

//INIZIALIZZO DEGLI STATI__________________________________________________________________________________________________________

    const [image, setImage] = useState(playlistImage);

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken');

//CONTROLLO IL TOKEN_______________________________________________________________________________________________________________

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//IMPOSTO L'IMMAGINE________________________________________________________________________________________________________________

    useEffect(() => {
    if (playlist.image) {
        setImage(playlist.image)
    }
    }, [])
    
//CONTROLLO IL TIPO DI UNA PLAYLIST__________________________________________________________________________________________________

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

//    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalModifyShow, setModalModifyShow] = useState(false);

    //controllo che tipo di playlist è 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        let callback
        spotifyApi.areFollowingPlaylist(user.id, playlist.id)
        .then(res =>{
            console.log(res.body)
            callback = res.body[0]
        })
        .catch((e)=>{
            console.log(e.status)
        })
        console.log(playlist)
        if ((playlist.ownerId !== userInfo.id)&&callback===true) {     
            setType('FOLLOWED')
        } else if ((playlist.ownerId !== userInfo.id)&&callback===false) {
            setType('NOTFOLLOWED')
        } else if (playlist.ownerId === userInfo.id){
            setType('MINE')
        }       
    }, [])

//INVERTE IL TIPO DELLA PLAYLIST__________________________________________________________________________________________________

    function switchFollow(){
        if (type === 'FOLLOWED') {
            //chiamata per smettere di seguire      //--> da implementare anche nella personalArea
        } else if (type === 'NOTFOLLOWED'){
            //chiamata per seguire 
        }
    }

//RENDERING_______________________________________________________________________________________________________________________________________

    return(
        <>
            <Card className='card d-flex flex-row bg-dark text-light' >
                <div className='btn btn-dark d-flex flex-row text-light text-start' onClick={() => { setModalShow(true) }}>
                    <Card.Img className='cardImg' src={image}/>
                    <Card.Body>
                        <Card.Title>{playlist.name}</Card.Title>
                        <Card.Text>{playlist.ownerName}</Card.Text>
                    </Card.Body>
                </div>
                <Card.Text>
                    { 
                    type === 'MINE' ? 
                                <div></div> :
                    type === 'FOLLOW' ? 
                                <div className='follow d-flex'>
                                    <Button className='btn-success action ' onClick={switchFollow}><StarFill/></Button> 
                                </div> :
                                <div className='notFollow d-flex'>
                                    <Button className='btn-danger action' onClick={switchFollow}><Star/></Button>
                                </div>
                    }
                </Card.Text>
            </Card>
            
            <PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} />
            {/* <ModalDeletePlaylist show={modalDeleteShow}  onClose={() => {setModalDeleteShow(false)}} playlist={playlist}/> */}
            <ModalModifyPlaylist show={modalModifyShow} onClose={() => {setModalModifyShow(false)}} playlist={playlist} updatePlaylists={updatePlaylists}/>
        </>
    )
}

export default Playlist2