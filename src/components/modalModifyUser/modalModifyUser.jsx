import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal, Row, Col } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import { spotifyApi } from '../../util/costanti';


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

