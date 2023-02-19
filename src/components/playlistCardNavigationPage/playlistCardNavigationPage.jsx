import { Button, Card, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import '../generalStyle.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';






function PlaylistCardNavigationPage({playlist, showFooter, createdPlaylist}){


    const userInfo = JSON.parse(localStorage.getItem('user'));     

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);


//CONTROLLA che tipo di playlist è ________________________________________________________________________________________________________________________________________________________

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
        //console.log(playlist.name,type)
    }, [playlist])

//INVERTE IL TIPO DELLA PLAYLIST____________________________________________________________________________________________________________________________________________________________

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

//RENDERING_________________________________________________________________________________________________________________________________________________________________________________

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
            
            {modalShow&&<PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => { setModalShow(false) }} showFooter={showFooter} createdPlaylist={createdPlaylist}/>}

        </>
    )
}

export default PlaylistCardNavigationPage