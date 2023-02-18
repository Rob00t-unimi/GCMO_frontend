import { Button, Card, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { StarFill, Lock, Unlock, Trash3, Pencil} from 'react-bootstrap-icons';
import '../generalStyle.css'
import PlaylistViewModal from '../playlistViewModal/playlistViewModal'
import ModalDeletePlaylist from '../modalDeletePlaylist/modalDeletePlaylist';
import ModalModifyPlaylist from '../modalModifyPlaylist/modalModifyPlaylist';
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';






function PlaylistCardPersonalArea({playlist, modifyPlaylist, userInfo, setRemovedPlaylist, modifyVisibility, addPlaylist}){


    const [image, setImage] = useState();

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalModifyShow, setModalModifyShow] = useState(false);

//CONTROLLA che tipo di playlist è __________________________________________________________________________________________________________________________________________________________________

    useEffect(() => {
        if(!userInfo) return
        if (playlist.ownerId !== userInfo.id) {     
            setType('FOLLOWED')
        } else if (playlist.public) {
            setType('PUBLIC')
        } else {
            setType('PRIVATE')
        }       
    }, [playlist, userInfo])


//IMPOSTA L'IMMAGINE_________________________________________________________________________________________________________________________________________________________________________________

useEffect(() => {
    if (playlist.image) {
        setImage(playlist.image)
    } else {
        setImage(playlistImage)
    }
    }, [playlist])


//INVERTE IL TIPO DELLA PLAYLIST____________________________________________________________________________________________________________________________________________________________________

    function switchPublic(){
        if (type === 'PUBLIC') {
            spotifyApi.changePlaylistDetails(playlist.id, {public: false})
            .then(data => {
                modifyVisibility()
                setType('PRIVATE')
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
        } else if (type === 'PRIVATE'){
            spotifyApi.changePlaylistDetails(playlist.id, {public: true})
            .then(data => {
                modifyVisibility()
                setType('PUBLIC')
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
        }
    }
    
//MODIFICA DOPO RIMOZIONE TRACCE____________________________________________________________________________________________________________________________________________________________________

//quando chiudo la modale per vidualizzare il contenuto di una playlist se ho cancellato dei brani faccio una get e richiedo di nuovo la playlist
//questo perchè potrebbe cambiare la copertina e il numero di canzoni all'interno
const [updatePlaylist, setUpdatePlaylist] = useState(false)
useEffect(() => {
    if(!modalShow&&updatePlaylist){
        spotifyApi.getPlaylist(playlist.id)
        .then(data=>{
            const newPlaylist = {
                image: data.body.images && data.body.images.length > 0 ? data.body.images[0].url : null,
                name: data.body.name,
                description: data.body.description ? data.body.description : null,
                id: data.body.id,
                ownerId: data.body.owner.id,
                ownerName: data.body.owner.display_name,
                public: data.body.public,
                totalTracks: data.body.tracks.total,
                uri: data.body.uri
            }
            console.log("nuova playlist", newPlaylist)
            setUpdatePlaylist(false)
            modifyPlaylist(newPlaylist)
        })
        .catch(err=>{
            ErrorStatusCheck(err)
        })
    }
}, [modalShow])


//RENDERING__________________________________________________________________________________________________________________________________________________________________________________________

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
                                    <div className='buttonCardOrizzontale' style={{width: "100px"}}/> {/*ho aggiunto questo div con la stessa larghezza di uno degli altri btn in modo da avere tutto allineato */}
                                    <Button className='buttonCardOrizzontale' onClick={()=>setModalDeleteShow(true)}><StarFill/></Button>
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
            
            {modalShow&&<PlaylistViewModal show={modalShow} playlist={playlist} onClose={() => {setModalShow(false)}} currentUser={userInfo} showFooter={null} setDeletedTracks={()=>setUpdatePlaylist(true)} addPlaylist={addPlaylist ? addPlaylist : null}/>}
            {modalDeleteShow&&<ModalDeletePlaylist show={modalDeleteShow}  onClose={() => {setModalDeleteShow(false)}} playlist={playlist} setRemovedPlaylist={setRemovedPlaylist}/> }
            {modalModifyShow&&<ModalModifyPlaylist show={modalModifyShow} onClose={() => {setModalModifyShow(false)}} playlist={playlist} modifyPlaylist={modifyPlaylist}/>}
        </>
    )
}

export default PlaylistCardPersonalArea