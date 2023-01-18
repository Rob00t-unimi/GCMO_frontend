import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import refreshToken from '../../util/refreshToken'

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});

function ModalModifyPlaylist({show, onClose, playlist}) {

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    const [isPublic, setIsPublic] = useState(playlist.public)
    const [title, setTitle] = useState(playlist.name)
    const [description, setDescription] = useState('')


    return(
        <>
            <Modal className='modal' show={show} size='xl' centered >

                <Modal.Header className='bg-dark text-light' >
                    <Modal.Title>MODIFICA LA TUA PLAYLIST</Modal.Title>
                    <Button className='btn-light' onClick={close}>Chiudi</Button>
                </Modal.Header>

                <Modal.Body className='bg-dark text-light'>
                    <div >
                        <div className=' d-flex justify-content-center flex-row'>
                            <input className=' text-center bg-dark text-light' type="text" placeholder={'Titolo'} value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
                
                            <select name="visibility" value={isPublic} onChange={(e)=> {setIsPublic(e.target.value)}}>
                                <option className="text-center" value={true}> Pubblica </option>
                                <option className="text-center" value={false}> Privata </option>
                            </select>
                        </div>
                    <hr />
                        <div className=' d-flex justify-content-center flex-column bg-dark text-light' >
                            <div  className='descrizione bg-dark text-light  '>Descrizione </div>
                            <textarea className='bg-dark text-light ' type="text" placeholder={'Scrivi una descrizione..'} value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex justify-content-center bg-dark text-light'>
                    <Button className='btn-light btn-lg' onClick={async () => await onConfirmFunction()}> Salva </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

    function close(){
        if (title===''||title==null) {
            setTitle(playlist.title)            //non funziona, per qualche motivo non reimposta i campi allo stato iniziale
            setIsPublic(playlist.public)
            onClose()
            //setdescription
        }
        onClose()
    }

    function onConfirmFunction() {
        if (title===''||title==null) {
            setTitle(playlist.title)            //non funziona, per qualche motivo non reimposta i campi allo stato iniziale
            setIsPublic(playlist.public)
            alert("Le Modifiche non sono state attuate.")
            onClose()
            //setdescription
        }  else {
            if (title!==playlist.title || isPublic!==playlist.public /*|| description==! playlist.description*/){           //anche questa condizione non viene verificata correttamente
                spotifyApi.changePlaylistDetails(playlist.id, {name: title, description: description, public: isPublic})
                .then(data => {
                    alert("Playlist Modificata con Successo!")
                })
                .catch(e => {
                    console.log( e.response.status);
                    refreshToken()
                })
            } else {
                alert("Playlist Modificata con Successo!")
            }   
        }
    }
}

export default ModalModifyPlaylist