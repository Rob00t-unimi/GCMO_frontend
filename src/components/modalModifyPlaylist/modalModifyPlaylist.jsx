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

function ModalModifyPlaylist({show, onClose, playlist, updatePlaylists}) {

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    const [isPublic, setIsPublic] = useState(playlist.public)
    const [title, setTitle] = useState(playlist.name)
    const [description, setDescription] = useState(playlist.description)
    const [image, setImage] = useState();

    useEffect(() => {
        if (playlist.image) 
        setImage({url: playlist.image})
    }, [playlist.public])

    //IMPOSTA IMMAGINE_________________________________________________________

    function impostaImmagine(immagine){
        const immagineUrl = URL.createObjectURL(immagine)
        setImage({
            immagine: immagine,
            url: immagineUrl
        })
    }

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
                            <div className='d-flex flex-row'>
                                <textarea className='bg-dark text-light ' type="text" placeholder={'Scrivi una descrizione..'} value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
                                {image&&<div className='copertina'><img src={image.url}></img></div>}
                                {!image&&<div className='copertina text-center text-light'><div>Nessuna Immagine</div></div>}
                            </div>
                            <div className='d-flex justify-content-end'><div className='inputFoto'><input type="file" accept="image/jpeg" onChange={(event)=>{impostaImmagine(event.target.files[0])}}/></div></div>    
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

//CHIUSURA_____________________________________________________________________________________________________________

    function close(){           

        setIsPublic(playlist.public)                //se chiudo senza salvare ripristino i valori su quelli precedenti
        setTitle(playlist.name)
        setDescription(playlist.description)
        if (playlist.image){
            setImage(playlist.image)
        } else {
            setImage()
        }

        onClose()
    }


//SALVA________________________________________________________________________________________________________________

    function onConfirmFunction() {
    
        spotifyApi.changePlaylistDetails(playlist.id, {name: title, description: description, public: isPublic})
        .then(data => {

            if(image) {

                const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                    reader.readAsDataURL(image.immagine);
                    reader.onloadend = async () => {
                        const base64 = reader.result.split(',')[1];
                        spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
                        .then(data => {})
                        .catch(e => {
                            alert("Non è stato Possibile caricare l'immagine della playlist")
                            console.log( e.response.status);
                            refreshToken()
                        })
                    }

            }
            const  newPlaylist = {
                image: image ? image.url : null,    //se la modifica è andata a buon fine creo una playlist modificata senza richiederla di nuovo alle api
                name: title,
                description: description ? description : null,
                id: playlist.id,
                ownerId: playlist.ownerId,
                ownerName: playlist.ownerName,
                public: isPublic ? isPublic : null,
            }

            updatePlaylists()
            alert("Playlist Modificata con Successo!")
            
            onClose()   //chiudo modale

        })
        .catch(e => {
            alert("Le Modifiche non sono state attuate.")
            refreshToken()
        })
        }

//SALVA e VAI AI BRANI______________________________________________________________________________________________________

    function onConfirmFunctionAndGo() {
    
        spotifyApi.changePlaylistDetails(playlist.id, {name: title, description: description, public: isPublic})
        .then(data => {

            if(image) {

                const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                    reader.readAsDataURL(image.immagine);
                    reader.onloadend = async () => {
                        const base64 = reader.result.split(',')[1];
                        spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
                        .then(data => {})
                        .catch(e => {
                            alert("Non è stato Possibile caricare l'immagine della playlist")
                            console.log( e.response.status);
                            refreshToken()
                        })
                    }

            }
            updatePlaylists()
        })
        .catch(e => {
            refreshToken()
        })

        const  newPlaylist = {
            image: image ? image.url : null,
            name: title,
            description: description ? description : null,      //se la modifica è andata a buon fine creo una playlist modificata senza richiederla di nuovo alle api
            id: playlist.id,
            ownerId: playlist.ownerId,
            ownerName: playlist.ownerName,
            public: isPublic ? isPublic : null,
        }


        localStorage.setItem('createdPlaylist', JSON.stringify(newPlaylist) )       //inserisco la playlist nel local storage per prenderla dalla navigationPage

        window.location = "http://localhost:3000/navigate"      //mando alla navigation page

    }
    
}


export default ModalModifyPlaylist