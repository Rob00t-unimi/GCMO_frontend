import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import refreshToken from '../../util/refreshToken'

//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc' //'61e53419c8a547eabe2729e093b43ae4';
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
    const [description, setDescription] = useState(playlist.description)
    const [image, setImage] = useState();

    useEffect(() => {
        if (playlist.image) 
        setImage({url: playlist.image})
    }, [playlist.public])

//IMPOSTA IMMAGINE___________________________________________________________________

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

        if(image) {

            const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                reader.readAsDataURL(image.immagine);
                reader.onloadend = async () => {
                    const base64 = reader.result.split(',')[1];
                    //UPLOAD COVER
                    spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
                    .then(data => {})
                    .catch(e => {
                        console.log( e.response.status);
                        alert("Non è stato Possibile caricare l'immagine della playlist")
                        if (e.response.status === 401 || e.response.status === 403) {
                            refreshToken()
                        }
                    })
                }

        }

        if (!title&&!description&&!isPublic) {
            alert("Playlist creata con Successo!")
            updatePlaylists()
            onClose()
            return
        }


        //creo l'oggetto per la chiamata
        let Modifiche = {}
        if (title) {Modifiche.name = title}
        if (description&&description!=="") {Modifiche.description = description}
        if (isPublic) {Modifiche.public = isPublic}
        
        console.log(Modifiche)

        //MODIFICA DETTAGLI
        spotifyApi.changePlaylistDetails(playlist.id, Modifiche)
        .then(data => {

            alert("Playlist creata con Successo!")
            updatePlaylists()
            onClose()

        })
        .catch(e => {
            console.log( e.response.status);
            alert("Le Modifiche non sono state attuate.")
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    }

//SALVA e VAI AI BRANI______________________________________________________________________________________________________

    function onConfirmFunctionAndGo() {
    
        // //MODIFICA DETTAGLI
        // spotifyApi.changePlaylistDetails(playlist.id, {name: title, description: description, public: isPublic})
        // .then(data => {

        //     if(image) {

        //         const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
        //             reader.readAsDataURL(image.immagine);
        //             reader.onloadend = async () => {
        //                 const base64 = reader.result.split(',')[1];
        //                 //UPLOAD COVER
        //                 spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
        //                 .then(data => {})
        //                 .catch(e => {
        //                     console.log( e.response.status);
        //                     alert("Non è stato Possibile caricare l'immagine della playlist")
        //                     if (e.response.status === 401 || e.response.status === 403) {
        //                         refreshToken()
        //                     }
        //                 })
        //             }

        //     }
        //     updatePlaylists()
        // })
        // .catch(e => {
        //     console.log( e.response.status);
        //     if (e.response.status === 401 || e.response.status === 403) {
        //         refreshToken()
        //     }
        // })

        // const  newPlaylist = {
        //     image: image ? image.url : null,
        //     name: title,
        //     description: description ? description : null,      //se la modifica è andata a buon fine creo una playlist modificata senza richiederla di nuovo alle api
        //     id: playlist.id,
        //     ownerId: playlist.ownerId,
        //     ownerName: playlist.ownerName,
        //     public: isPublic ? isPublic : null,
        // }


        // localStorage.setItem('createdPlaylist', JSON.stringify(newPlaylist) )       //inserisco la playlist nel local storage per prenderla dalla navigationPage

        // close()

        // window.location = "http://localhost:3000/navigate"      //mando alla navigation page

    }
    
}


export default ModalModifyPlaylist

