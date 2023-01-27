import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal, Row, Col } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'

//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc'//'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function ModalModifyUser({show, onClose, userInfo}) {

    const linkProfilo = "https://open.spotify.com/user/" + userInfo.id
    const linkAccount = "https://www.spotify.com/it/account/profile/"

     return(
        <Modal show={show} size='lg' centered>
             <Modal.Header>
                <Modal.Title>MODIFICA INFORMAZIONI UTENTE</Modal.Title>
                <Button className='btn-dark' onClick={onClose}>Chiudi</Button>
           </Modal.Header>
           <Modal.Body>
                <div>Sarai reindirizzato in una nuova scheda sulla pagina di spotify dove potrai modificare le informazioni sul tuo account e sul tuo profilo utente. <a href='https://support.spotify.com/it/article/username-and-display-name/?ref=related' target="_blank">More info</a></div>
           </Modal.Body>
           <Modal.Footer className='text-center'>
             
                <a className='btn btn-dark' href={linkProfilo} target="_blank" >Modifica Profilo</a>
                <a className='btn btn-dark' href={linkAccount} target="_blank" >Modifica Account</a>

           </Modal.Footer>
           

        </Modal>
     )
    
}


export default ModalModifyUser

