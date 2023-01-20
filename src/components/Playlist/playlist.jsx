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

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});


function Playlist({playlist, modificaPlaylist, indexPlaylist, updatePlaylists}){

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken');

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

//    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalModifyShow, setModalModifyShow] = useState(false);

    const [image, setImage] = useState(playlistImage);

    useEffect(() => {
    if (playlist.image) {
        setImage(playlist.image)
    }
    }, [])

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    //controllo che tipo di playlist è 
    useEffect(() => {
        console.log(playlist)
        if (playlist.ownerId !== userInfo.id) {     
            setType('FOLLOWED')
            return;
        }
        if (playlist.public) {
            
            setType('PUBLIC')
            return;
        }

        setType('PRIVATE')
    }, [])

    function switchPublic(){
        if (type === 'PUBLIC') {
            spotifyApi.changePlaylistDetails(playlist.id, {public: false})
            .then(data => {
                //updatePlaylists() 
                setType('PRIVATE')
                console.log("now private")
            })
            .catch(e => {
                console.log( e.response.status);
                refreshToken()
            })
        } else if (type === 'PRIVATE'){
            spotifyApi.changePlaylistDetails(playlist.id, {public: true})
            .then(data => {
                //updatePlaylists()
                setType('PUBLIC')
                console.log("now public")
            })
            .catch(e => {
                console.log( e.response.status);
                refreshToken()
            })
        }
    }

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
                                    <Button className='action'><StarFill/></Button>
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
            <ModalModifyPlaylist show={modalModifyShow} onClose={() => {setModalModifyShow(false)}} playlist={playlist} modificaPlaylist={modificaPlaylist} indexPlaylist={indexPlaylist}/>
        </>
    )
}

export default Playlist