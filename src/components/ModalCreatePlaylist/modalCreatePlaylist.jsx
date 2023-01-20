import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, ListGroup, Modal} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import refreshToken from '../../util/refreshToken'

//import imageCompression from 'browser-image-compression';   //libreria per comprimere immagini

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
    const [image, setImage] = useState();

//CHIUDI MODALE_______________________________________________________________________

    function close() {      
        setIsPublic(false);
        setTitle('')
        setDescription('')
        onClose();
    }

// //COMPRESSIONE IMMAGINE_______________________________________________________________


// async function compressImage(image) {   
//     const options = {
//         maxSizeMB: 0.25, // massimo peso dell'immagine in MB
//         useWebWorker: true // utilizzare web worker del browser
//     }
//     // chiamare la libreria per comprimere l'immagine
//     const compressedImage = await imageCompression(image, options);
//     return compressedImage;
// }

//____________________________________________________________________________________

console.log(image)

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
                            <div className='d-flex flex-row'>
                                <textarea className='bg-dark text-light ' type="text" placeholder={'Scrivi una descrizione..'} value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
                                {image&&<div className='copertina'><img src={URL.createObjectURL(image)}></img></div>}
                                {!image&&<div className='copertina text-center text-light'><div>Nessuna Immagine</div></div>}
                            </div>
                            <div className='d-flex justify-content-end'><div className='inputFoto'><input type="file" accept="image/jpeg" onChange={(event)=>{setImage(event.target.files[0])}}/></div></div>    
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


//SALVA_______________________________________________________________________________________________

    function onConfirmFunction() {

        if(!title||title==='') {
            return alert("Non è stato Possibile Creare la playlist: inserire un titolo.")
        }

        let id = null
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(data => {
                console.log(data)
                id = data.body.id

                if (image) {
                   
                    //spotifyApi.uploadCustomPlaylistCoverImage(id, ...)
                    
                }

                alert("Playlist creata con Successo!")
            })
            .catch(e => {
                alert("Non è stato Possibile Creare la playlist")
                console.log( e.response.status);
                refreshToken()
            })
    }

    //SALVA E VAI AD AGGIUNGERE TRACCE__________________________________________________________________

    function onConfirmFunctionAndGo() {

        if(!title||title==='') {
            return alert("Non è stato Possibile Creare la playlist: inserire un titolo.")
        }

        let id = null
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(item => {
                console.log(item)
                id = item.body.id

                if (image) {

                    //spotifyApi.uploadCustomPlaylistCoverImage(id, ...)
                    
                }

                const createdPlaylist = {
                    image: item.body.images && item.body.images.length > 0 ? item.body.images[0].url : null,
                    name: item.body.name,
                    description: item.body.description ? item.body.description : null,
                    id: item.body.id,
                    ownerId: item.body.owner.id,
                    ownerName: item.body.owner.display_name,
                    public: item.body.public,
                }

                localStorage.setItem('createdPlaylist', JSON.stringify(createdPlaylist) )

                window.location = "http://localhost:3000/navigate" 
                
            })
            .catch(e => {
                alert("Non è stato Possibile Creare la playlist")
                console.log( e.response.status);
                refreshToken()
            })
    }
}

export default ModalCreatePlaylist