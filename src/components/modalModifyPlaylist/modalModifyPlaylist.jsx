import React, { useEffect, useState, useContext } from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import '../ModalCreatePlaylist/style.css'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



function ModalModifyPlaylist({show, onClose, playlist, modifyPlaylist }) {

    const {setToast} = useContext(ToastContext)

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
    }, [])

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
            <Modal className='modal' show={show} animation={true} size='xl' centered >
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
                    <Button className='btn-light btn-lg' onClick={async () => onConfirmFunction()}> Salva </Button>
                    <Button className='btn-success btn-lg' onClick={async () => onConfirmFunction("ADDTRACKS")}> Aggiungi brani </Button>
                </Modal.Footer>
            </Modal>
        </>
    )


    async function addingImage() {
        if(image&&image.url!==playlist.image) {

            const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
            reader.readAsDataURL(image.immagine);
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                //UPLOAD IMMAGINE DI COPERTINA
                spotifyApi.uploadCustomPlaylistCoverImage(playlist.id, base64)
                .catch(err => {
                    setToast(true, "Non siamo riusciti ad aggiungere l'immagine alla playlist.")
                    ErrorStatusCheck(err)
                })
            }
        }
        return
    }

    async function onConfirmFunction(seAddTracks) {

        if (!title) {
            setToast(true, "Impossibile modificare la playlist senza un titolo")
            return
        }

        //creo l'oggetto per la chiamata
        let Modifiche = {
            name: title,
            description: description,
            public: isPublic==="true" ? true : false
        }

        //MODIFICA DETTAGLI
        try {
            const data = await spotifyApi.changePlaylistDetails(playlist.id, Modifiche)
            await addingImage()

            let modifiedPlaylist = {
                image: image&&image.url ? image.url : null,
                name: Modifiche.name,
                description: Modifiche.description,
                id: playlist.id,
                ownerId: playlist.ownerId,
                ownerName: playlist.ownerName,
                public: Modifiche.public,
                totalTracks: playlist.totalTracks,
                uri: playlist.uri,
                oldImage: image.url!==playlist.image ? playlist.image : null        //se ho cambiato immagine salvo anche l'url di quella vecchia
            }                                                                      //problema con foto, e pubblico/privato

            if (seAddTracks==="ADDTRACKS") {
                addPlaylistInStorage(modifiedPlaylist)
            } else {
                modifyPlaylist(modifiedPlaylist)
                setToast(true, "Playlist Modificata con Successo!")
                onClose() 
            }
        } catch (err) {
            setToast(true, "Non siamo riusciti ad attuare le modifiche.")
            ErrorStatusCheck(err)
        }
    }

    function addPlaylistInStorage(thisPlaylist){
        
        thisPlaylist.image = thisPlaylist.image!==null ? "ASK" : null
        
        spotifyApi.getPlaylistTracks(thisPlaylist.id)
        .then((tracks) => {
            console.log(tracks)
            const tracce = tracks.body.items.map(traccia=>{
                return traccia.track.id
            })

            localStorage.setItem('createdPlaylistTracks', JSON.stringify(tracce))
            localStorage.setItem("createdPlaylist", JSON.stringify(thisPlaylist))

            window.location = "http://localhost:3000/navigate"      //mando alla navigation page
        })
        .catch(e=>{
            ErrorStatusCheck()
        })
         
    }
    
}


export default ModalModifyPlaylist

