import SpotifyWebApi from 'spotify-web-api-node';
import {Modal, Button } from 'react-bootstrap'
import { useEffect } from 'react';

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4' //238334b666894f049d233d6c1bb3c3fc
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});

function ModalDeletePlaylist({show, onClose, playlist}) {
   
    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    function deletePlaylist() {

        if(playlist.ownerId !== userInfo.id) {
            //spotifyApi.
        }

        //credo che non si possa eliminare una playlist con le api
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