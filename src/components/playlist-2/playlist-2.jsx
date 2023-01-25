import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import './style.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import ModalModifyPlaylist from '../modalModifyPlaylist/modalModifyPlaylist';
import refreshToken from '../../util/refreshToken'
import playlistImage from '../../assets/generalPlaylistImage.jpg'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









function Playlist2({playlist}){

//INIZIALIZZO DEGLI STATI__________________________________________________________________________________________________________

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
        spotifyApi.areFollowingPlaylist(playlist.ownerId, playlist.id, [userInfo.id])
        .then(res =>{
            if ((playlist.ownerId !== userInfo.id)&&res.body[0]) {     
                setType('FOLLOWED')
            } else if ((playlist.ownerId !== userInfo.id)&&!res.body[0]) {
                setType('NOTFOLLOWED')
            } else if (playlist.ownerId === userInfo.id){
                setType('MINE')
            }       
         })
        .catch((e)=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
        console.log(playlist.name,type)
    }, [playlist])

//INVERTE IL TIPO DELLA PLAYLIST__________________________________________________________________________________________________

    function switchFollow(){
        if (type === 'FOLLOWED') {
            //chiamata per smettere di seguire     
            spotifyApi.unfollowPlaylist(playlist.id)
            .then(res=>{
                setType('NOTFOLLOWED')
            })
            .catch(e=>{
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
            })
        } else if (type === 'NOTFOLLOWED'){
            //chiamata per seguire 
            spotifyApi.followPlaylist(playlist.id)
            .then(res=>{
                setType('FOLLOWED')
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
                    <Card.Img className='cardImg' src={playlist.image ? playlist.image : playlistImage}/>
                    <Card.Body>
                        <Card.Title>{playlist.name}</Card.Title>
                        <Card.Text>{playlist.ownerName}</Card.Text>
                    </Card.Body>
                </div>
                <Card.Text>
                    { 
                    type === 'MINE' ? 
                                <div></div> :
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
            
            {modalShow&&<PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} />}

        </>
    )
}

export default Playlist2