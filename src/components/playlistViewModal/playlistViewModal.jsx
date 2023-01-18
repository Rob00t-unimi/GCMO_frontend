import {Modal, Button } from 'react-bootstrap'

//const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
//const spotifyApi = new SpotifyWebApi({
//  clientId: CLIENT_ID
//});

function PlaylistViewModal({show, onClose, playlist}) {
    
    return (
        <Modal show={show}>
            ciao
            <Button onClick={onClose}></Button>
        </Modal>
    )
}

export default PlaylistViewModal