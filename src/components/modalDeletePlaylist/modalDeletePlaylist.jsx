import SpotifyWebApi from 'spotify-web-api-node';
import {Modal, Button } from 'react-bootstrap'
import { useEffect } from 'react';
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';

function ModalDeletePlaylist({show, onClose, playlist, setRemovedPlaylist}) {
   
    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])


        
    function deletePlaylist() {

         //chiamata per smettere di seguire = cancellare (spotify non rimuove veramente le playlist quindi non c'è nemmeno una chiamata per farlo)   
         spotifyApi.unfollowPlaylist(playlist.id)
         .then(res=>{
             setRemovedPlaylist()
             alert("Playlist Eliminata")
             onClose()
         })
         .catch(err => {
            ErrorStatusCheck(err)
        })
     }




    return (
        <Modal show={show} centered>
            <Modal.Body>
                Sei sicuro di voler eliminare questa Playlist?
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={deletePlaylist}>Si</Button>
                <Button className='btn-light' onClick={onClose}>No</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeletePlaylist