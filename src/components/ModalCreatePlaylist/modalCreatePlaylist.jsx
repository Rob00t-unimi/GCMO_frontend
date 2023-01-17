import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import refreshToken from '../../util/refreshToken'

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});

function ModalCreatePlaylist({show, onClose}) {

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])



    const [isPublic, setIsPublic] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    function close() {      //cosi onClose non funziona
        setIsPublic(false);
        setTitle('')
        setDescription('')
        onClose();
    }


    return(
        <>
            <Modal className='modal' show={show} size='xl' centered >

                <Modal.Header className='bg-dark text-light' >
                    <Modal.Title>CREA LA TUA PLAYLIST</Modal.Title>
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
                    <Button className='btn-success btn-lg' onClick={async () => await onConfirmFunctionAndGo()}> Aggiungi brani </Button>
                </Modal.Footer>
            </Modal>
        </>
    )


    function onConfirmFunction() {
        if (title==='') {
            spotifyApi.createPlaylist('Titolo', { public: isPublic})
            .then(data => {
                alert("Playlist creata con Successo!")
            })
            .catch(e => {
                console.log(e.response.status);
                refreshToken()
            })
        }  else {
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(data => {
                alert("Playlist creata con Successo!")
            })
            .catch(e => {
                console.log( e.response.status);
                refreshToken()
            })
        }
    }

    function onConfirmFunctionAndGo() {
        if (title==='') {
            spotifyApi.createPlaylist('Titolo', { public: isPublic})
            .then(data => {
                localStorage.setItem('createdPlaylist', JSON.stringify({
                    title: data.body.name,
                    id: data.body.id,
                    image: data.body.images[0].url? data.body.images[0].url : null,
                }))
                window.location = '/navigate'
            })
            .catch(e => {
                console.log(e.response.status);
                refreshToken()
            })
        }  else {
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(data => {
                localStorage.setItem('createdPlaylist', JSON.stringify({
                    title: data.body.name,
                    id: data.body.id,
                    image: data.body.images[0].url? data.body.images[0].url : null,
                }))
                window.location = '/navigate'
            })
            .catch(e => {
                console.log(e.response.status);
                refreshToken()
            })
        }
    }

}

export default ModalCreatePlaylist