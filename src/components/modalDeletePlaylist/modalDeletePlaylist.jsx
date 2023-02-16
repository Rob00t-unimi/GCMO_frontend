import {Modal, Button } from 'react-bootstrap'
import { useContext  } from 'react';
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



function ModalDeletePlaylist({show, onClose, playlist, setRemovedPlaylist}) {


   
    const {setToast} = useContext(ToastContext)

    const userInfo = JSON.parse(localStorage.getItem('user'));  


    //RIMUOVI PLAYLIST_____________________________________________________________________________________________________________________________________

    function deletePlaylist() {

         //chiamata per smettere di seguire = cancellare (spotify non rimuove veramente le playlist quindi non c'è nemmeno una chiamata per farlo)   
         spotifyApi.unfollowPlaylist(playlist.id)
         .then(res=>{
            setToast(true, "Platlist Eliminata")
            setRemovedPlaylist()
            onClose()
         })
         .catch(err => {
            ErrorStatusCheck(err)
        })
     }


    //______________________________________________________________________________________________________________________________________________________

    return (
        <Modal show={show} animation={true} centered>
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