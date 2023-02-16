import React from 'react'
import { useState } from 'react';
import { Button, Modal, } from 'react-bootstrap'
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import Logout from '../../util/logout'


function ModalModifyUser({show, onClose, userInfo}) {

    const linkProfilo = "https://open.spotify.com/user/" + userInfo.id
    const linkAccount = "https://www.spotify.com/it/account/profile/"

    const [statoModale, setStatoModale] = useState(false)


function cancellazioneUtente() {
     window.open('https://www.spotify.com/it/account/apps/', '_blank');
     Logout()
}

function cancellazioneAccount() {
     window.open('https://support.spotify.com/it/close-account/', '_blank');
     Logout()
}


     return(
        !statoModale ? 
        <Modal show={show} animation={true} size='lg' centered>
             <Modal.Header>
                <Modal.Title>MODIFICA INFORMAZIONI UTENTE</Modal.Title>
                <Button className='btn-dark' onClick={onClose}>Chiudi</Button>
           </Modal.Header>
           <Modal.Body>
                <div>Sarai reindirizzato in una nuova scheda sulla pagina di spotify dove potrai modificare le informazioni sul tuo account e sul tuo profilo utente. <a href='https://support.spotify.com/it/article/username-and-display-name/?ref=related' target="_blank">More info</a></div>
           </Modal.Body>
           <Modal.Footer className='text-center'>
               
               <Button className='btn-danger' style={{marginRight: "20rem"}} onClick={()=>setStatoModale(true)}>Rimuovi account</Button> 
               <a className='btn btn-dark' href={linkProfilo} target="_blank" >Modifica Profilo</a>
               <a className='btn btn-dark' href={linkAccount} target="_blank" >Modifica Account</a>

           </Modal.Footer>
        </Modal>

        :

     <Modal show={show} size='lg' centered>
          <Modal.Header>
               <Modal.Title>CHIUSURA PROFILO UTENTE</Modal.Title>
               <Button className='btn-dark' onClick={()=>setStatoModale(false)}>Indietro</Button>
          </Modal.Header>
          <Modal.Body>
               <div>Verrai reindirizzato su spotify dove potrai scollegare il tuo account da GCMO, oppure eliminare l'account di Spotify</div>
          </Modal.Body>
          <Modal.Footer className='text-center'>
               <Button className='btn-danger' onClick={cancellazioneUtente} >Scollegati da GCMO</Button>
               <Button className='btn-dark' onClick={cancellazioneAccount}>Cancella account su Spotify</Button>
          </Modal.Footer>
     </Modal>
     )
    
}

export default ModalModifyUser

