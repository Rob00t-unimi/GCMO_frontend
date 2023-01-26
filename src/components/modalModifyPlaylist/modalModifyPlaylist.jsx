import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import ErrorStatusCheck from '../../util/errorStatusCheck'

//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function ModalModifyPlaylist({show, onClose, playlist, updatePlaylists}) {

//CONTROLLO IL TOKEN E LO AGGIUNGO ALL'OGGETTO SPOTIFYAPI____________________________

const accessToken = localStorage.getItem('accessToken');

useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
}, [accessToken])

//INIZIALIZZO UN PO' DI STATI_________________________________________________________

    const [isPublic, setIsPublic] = useState(playlist.public)
    const [title, setTitle] = useState(playlist.name)
    const [image, setImage] = useState();

//INIZIALIZZO description (il value dell'input text non può essere null)
const [description, setDescription] = useState()

useEffect(() => {
    if (playlist.description) {
    setDescription(playlist.description)
    }
},[])

//IMPOSTA IMMAGINE___________________________________________________________________

    useEffect(() => {
        if (playlist.image) 
        setImage({url: playlist.image})
    }, [playlist.public])

    function impostaImmagine(immagine){
        const immagineUrl = URL.createObjectURL(immagine)
        setImage({
            immagine: immagine,
            url: immagineUrl
        })
    }

//RENDERING____________________________________________________________________________________________________________________________________________________________________________________________________________
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

    // function close(){           

    //     setIsPublic(playlist.public)                //se chiudo senza salvare ripristino i valori su quelli precedenti
    //     setTitle(playlist.name)
    //     setDescription(playlist.description)
    //     if (playlist.image){
    //         setImage(playlist.image)
    //     } else {
    //         setImage()
    //     }

    //     onClose()
    // }


//SALVA________________________________________________________________________________________________________________

    function onConfirmFunction() {

        if (!title) {
            alert("Impossibile modificare la playlist senza un titolo")
            return
        }

        //creo l'oggetto per la chiamata
        let Modifiche = {}
        if (title) {Modifiche.name = title}
        if (description&&description!=="") {Modifiche.description = description}
        if (isPublic) {Modifiche.public = isPublic}

        //MODIFICA DETTAGLI
        spotifyApi.changePlaylistDetails(playlist.id, Modifiche)
        .then(data => {

            if(image&&image.url!==playlist.image) {

                const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                    reader.readAsDataURL(image.immagine);
                    reader.onloadend = async () => {
                        const base64 = reader.result.split(',')[1];
                        //UPLOAD COVER
                        spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
                        .then(data => {
                            updatePlaylists()
                            alert("Playlist modificata con Successo!")
                            onClose()
                        })
                        .catch(err => {
                            alert("Non è stato Possibile caricare l'immagine della playlist")
                            ErrorStatusCheck(err)
                        })
                    }
            } else {
                updatePlaylists()
                alert("Playlist modificata con Successo!")
                onClose()
            }
        })
        .catch(err => {
            alert("Le Modifiche non sono state attuate.")
            ErrorStatusCheck(err)
        })
    }

//SALVA e VAI AI BRANI______________________________________________________________________________________________________

    function onConfirmFunctionAndGo() {
    
        onConfirmFunction()

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

