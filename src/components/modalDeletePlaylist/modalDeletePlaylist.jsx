import SpotifyWebApi from 'spotify-web-api-node';
import {Modal, Button } from 'react-bootstrap'
import { useEffect } from 'react';
import ErrorStatusCheck from '../../util/errorStatusCheck'

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc'//'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});

function ModalDeletePlaylist({show, onClose, playlist, updatePlaylists}) {
   
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
             updatePlaylists()
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