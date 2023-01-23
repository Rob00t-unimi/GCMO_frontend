import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Lock, Unlock, Trash3, Pencil} from 'react-bootstrap-icons';
import './style.css'
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









function Playlist({playlist, updatePlaylists}){

//INIZIALIZZO DEGLI STATI__________________________________________________________________________________________________________

    const [image, setImage] = useState();

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken');

//CONTROLLO IL TOKEN_______________________________________________________________________________________________________________

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//CONTROLLO IL TIPO DI UNA PLAYLIST__________________________________________________________________________________________________

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

//    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalModifyShow, setModalModifyShow] = useState(false);

    //controllo che tipo di playlist è 
    useEffect(() => {
        console.log(playlist)
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
            .catch(e => {
                console.log( e.response.status);
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
            })
        } else if (type === 'PRIVATE'){
            spotifyApi.changePlaylistDetails(playlist.id, {public: true})
            .then(data => {
                updatePlaylists()
            })
            .catch(e => {
                console.log( e.response.status);
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
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
        .catch(e=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
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
                    type === 'FOLLOWED' ? 
                                <div className= 'followed d-flex'>
                                    {/* <Button className='action btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button> */}
                                    <Button className='action' onClick={unfollowPlaylist}><StarFill/></Button>
                                </div> :
                    type === 'PUBLIC' ? 
                                <div className='public d-flex'>
                                    <Button className='action btn-light' onClick={() => { setModalModifyShow(true) }}><Pencil/></Button>
                                    {/* <Button className='action btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button> */}
                                    <Button className='btn-success action ' onClick={switchPublic}><Unlock/></Button> 
                                </div> :

                                <div className='private d-flex'>
                                    <Button className='action btn-light' onClick={() => { setModalModifyShow(true) }}><Pencil/></Button>
                                    {/* <Button className='action btn-light' onClick={() => { setModalDeleteShow(true) }}><Trash3 /></Button> */}
                                    <Button className='btn-danger action' onClick={switchPublic}><Lock/></Button>
                                </div>
                    }
                </Card.Text>
            </Card>
            
            <PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} />
            {/* <ModalDeletePlaylist show={modalDeleteShow}  onClose={() => {setModalDeleteShow(false)}} playlist={playlist}/> */}
            {modalModifyShow&&<ModalModifyPlaylist show={modalModifyShow} onClose={() => {setModalModifyShow(false)}} playlist={playlist} updatePlaylists={updatePlaylists}/>}
        </>
    )
}

export default Playlist