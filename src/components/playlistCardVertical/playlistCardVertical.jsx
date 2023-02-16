import { Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import '../generalStyle.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';







function PlaylistCardVertical({playlist, showFooter, createdPlaylist}){

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    
//CONTROLLO IL TIPO DI UNA PLAYLIST__________________________________________________________________________________________________

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

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
        //console.log(playlist.name,type)
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
            <Card className='cardVertical bg-dark text-light' >
                <div className='btn btn-dark text-light text-start' onClick={() => { setModalShow(true) }}>
                    <Card.Img src={playlist.image ? playlist.image : playlistImage}/>
                    <Card.Body>
                        <Card.Title>{playlist.name}</Card.Title>
                        <Card.Text>{playlist.ownerName}</Card.Text>
                    </Card.Body>
                </div>
                <div className="d-flex align-items-end" style={{height: "100%"}}>
                    { 
                    type === 'MINE' ? 
                                <div></div> :
                    type === 'FOLLOWED' ? 
                                <div className='d-flex'>
                                    <Button className='verticalCardBtn ' onClick={switchFollow}><StarFill/></Button> 
                                </div> :
                                <div className='d-flex'>
                                    <Button className='verticalCardBtn' onClick={switchFollow}><Star/></Button>
                                </div>
                    }
                </div>
            </Card>
            
            {modalShow&&<PlaylistViewModal show={modalShow}  onClose={() => { setModalShow(false) }} playlist={playlist} showFooter={showFooter} createdPlaylist={createdPlaylist}/>}
        </>
    )
}

export default PlaylistCardVertical