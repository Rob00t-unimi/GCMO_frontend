import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Modal} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import refreshToken from '../../util/refreshToken'

//import imageCompression from 'browser-image-compression';   //libreria per comprimere immagini


//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4' //238334b666894f049d233d6c1bb3c3fc
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function ModalCreatePlaylist({show, onClose, updatePlaylists}) {

//CONTROLLO IL TOKEN E LO AGGIUNGO ALL'OGGETTO SPOTIFYAPI____________________________

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//INIZIALIZZO UN PO' DI STATI_________________________________________________________

    const [isPublic, setIsPublic] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null);

//CHIUDI MODALE_______________________________________________________________________

    function close() {  
        
        setIsPublic(false)
        setTitle('')
        setDescription('')
        setImage(null)    
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
        //MODIFICA DETTAGLI
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(data => {
                console.log(data)
                id = data.body.id

                if (image) {

                    const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                    reader.readAsDataURL(image);
                    reader.onloadend = async () => {
                        const base64 = reader.result.split(',')[1];
                        //UPLOAD IMMAGINE DI COPERTINA
                        spotifyApi.uploadCustomPlaylistCoverImage(id, base64)
                        .then(data => {
                            updatePlaylists()
                            alert("Playlist creata con Successo!")
                            close()
                        })
                        .catch(e => {
                            console.log( e.response.status);
                            alert("Non è stato Possibile caricare l'immagine della playlist")
                            if (e.response.status === 401 || e.response.status === 403) {
                                refreshToken()
                            }
                        })
                    }
                } else {
                    updatePlaylists()
                    alert("Playlist creata con Successo!")
                    close()
                }
            })
            .catch(e => {
                console.log( e.response.status);
                alert("Non è stato Possibile Creare la playlist")
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
            })
    }

    //SALVA E VAI AD AGGIUNGERE TRACCE__________________________________________________________________

    function onConfirmFunctionAndGo() {

        if(!title||title==='') {
            return alert("Non è stato Possibile Creare la playlist: inserire un titolo.")
        }

        let id = null
        //MODIFICA DEI DETTAGLI
            spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            .then(item => {
                console.log(item)
                id = item.body.id

                if (image) {

                    const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
                    reader.readAsDataURL(image);
                    reader.onloadend = async () => {
                        const base64 = reader.result.split(',')[1];
                        //UPLOAD IMMAGINE DI COPERTINA
                        spotifyApi.uploadCustomPlaylistCoverImage(id, base64)
                        .then(data => {
                            finish()
                        })
                        .catch(e => {
                            console.log( e.response.status);
                            alert("Non è stato Possibile caricare l'immagine della playlist")
                            if (e.response.status === 401 || e.response.status === 403) {
                                refreshToken()
                            }
                        })
                    }
                    
                } else {
                    finish()
                }

              const finish = () => {  //CREO E SALVO NEL LOCAL STORAGE LA NUOVA PLAYLIST 

                spotifyApi.getPlaylist(id)
                .then(item =>{
                    const createdPlaylist =  {
                        image: item.body.images && item.body.images.length > 0 ? item.body.images[0].url : null,
                        name: item.body.name,
                        description: item.body.description ? item.body.description : null,
                        id: item.body.id,
                        ownerId: item.body.owner.id,
                        ownerName: item.body.owner.display_name,
                        public: item.body.public,
                      }
                      console.log("createdplaylist", createdPlaylist)

                       localStorage.setItem('createdPlaylist', JSON.stringify(createdPlaylist) )

                       close()

                        //REINDIRIZZO ALLA PAGINA DI NAVIGAZIONE PER AGGIUNGERE LE CANZONI
                        window.location = "http://localhost:3000/navigate" 
                })
                .catch(e => {
                    console.log( e.response.status);
                    if (e.response.status === 401 || e.response.status === 403) {
                        refreshToken()
                    }
                })
            }
                
            })
            .catch(e => {
                console.log( e.response.status);
                alert("Non è stato Possibile Creare la playlist")
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
            })
    }
}

export default ModalCreatePlaylist