import SpotifyWebApi from 'spotify-web-api-node';
import {Modal, Button } from 'react-bootstrap'
import { useEffect } from 'react';
import refreshToken from '../../util/refreshToken';

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4' //238334b666894f049d233d6c1bb3c3fc
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});

function ModalDeletePlaylist({show, onClose, playlistId, trackUri}) {
   

    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    function removeTrack() {
        spotifyApi.removeTracksFromPlaylist(playlistId, [{uri: trackUri}])
        .then (
            onClose()
        )
        .catch(e => {
            console.log( e.response.status);
            alert('La traccia non è stata rimossa')
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })        
    }



    return (
        <Modal show={show} centered>
            <Modal.Body>
                Sei sicuro di voler eliminare questa Playlist?
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={()=>removeTrack()}>Si</Button>
                <Button className='btn-light' onClick={onClose}>No</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeletePlaylist