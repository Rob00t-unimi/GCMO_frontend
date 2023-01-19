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
    const [description, setDescription] = useState(playlist.description)


    return(
        <>
            <Modal className='modal' show={show} size='xl' centered >

                <Modal.Header className='bg-dark text-light' >
                    <Modal.Title>MODIFICA LA TUA PLAYLIST</Modal.Title>
                    <Button className='btn-light' onClick={onClose}>Chiudi</Button>
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



    function onConfirmFunction() {
       
        spotifyApi.changePlaylistDetails(playlist.id, {name: title, description: description, public: isPublic})
        .then(data => {
            setTitle(playlist.title)
            setIsPublic(playlist.public)
            setDescription(playlist.description) 
            alert("Playlist Modificata con Successo!")
        })
        .catch(e => {
            alert("Le Modifiche non sono state attuate.")
            refreshToken()
        })
        }
}


export default ModalModifyPlaylist