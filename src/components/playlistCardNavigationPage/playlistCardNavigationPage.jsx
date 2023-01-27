import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import '../general.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});









function PlaylistCardNavigationPage({playlist, showFooter}){

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
         .catch(err => {
            ErrorStatusCheck(err)
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
            .catch(err => {
                ErrorStatusCheck(err)
            })
        } else if (type === 'NOTFOLLOWED'){
            //chiamata per seguire 
            spotifyApi.followPlaylist(playlist.id)
            .then(res=>{
                setType('FOLLOWED')
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
                <div className='btnCard btn btn-dark d-flex flex-row text-light text-start' onClick={() => { setModalShow(true) }}>
                    <Card.Img className='cardImg' src={playlist.image ? playlist.image : playlistImage}/>
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
                <Card.Text>
                    { 
                    type === 'MINE' ? 
                                <div className='buttonCardOrizzontale' style={{width: "44px"}}/> :
                    type === 'FOLLOWED' ? 
                                <div className='d-flex'>
                                    <Button className='buttonCardOrizzontale ' onClick={switchFollow}><StarFill/></Button> 
                                </div> :
                                <div className='d-flex'>
                                    <Button className='buttonCardOrizzontale' onClick={switchFollow}><Star/></Button>
                                </div>
                    }
                </Card.Text>
            </Card>
            
            {modalShow&&<PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} showFooter={showFooter}/>}

        </>
    )
}

export default PlaylistCardNavigationPage