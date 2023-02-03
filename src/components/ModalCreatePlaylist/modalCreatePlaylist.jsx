import React, { useEffect, useState, useContext } from 'react'

import { Button, Modal} from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';




function ModalCreatePlaylist({show, onClose, addPlaylist}) {

    const {setToast} = useContext(ToastContext)

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

    return(
        <>
            <Modal className='modal' show={show} animation={true} size='xl' centered >

                <Modal.Header className='bg-dark text-light' >
                    <Modal.Title>CREA LA TUA PLAYLIST</Modal.Title>
                    <Button className='btn-light' onClick={onClose}>Chiudi</Button>
                </Modal.Header>

                <Modal.Body className='bg-dark text-light'>
                    <div >
                        <div className=' d-flex justify-content-center flex-row'>
                            <input className='text-center bg-dark text-light' type="text" placeholder={'Titolo'} value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
                
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
                    <Button className='btn-light btn-lg' onClick={async () => onConfirmFunction()}> Salva </Button>
                    <Button className='btn-success btn-lg' onClick={async () => onConfirmFunction("ADDTRACKS")}> Salva e Aggiungi brani </Button>
                </Modal.Footer>
            </Modal>

            
        </>
    )



//SALVA_______________________________________________________________________________________________

    async function addingImage(id) {
        if (image) {

            const reader = new FileReader();            //l'immagine è richiesta in base64, la converto con l'oggetto reader
            reader.readAsDataURL(image);
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                //UPLOAD IMMAGINE DI COPERTINA
                spotifyApi.uploadCustomPlaylistCoverImage(id, base64)
                .catch(err => {
                    setToast(true, "Non siamo riusciti ad aggiungere l'immagine alla playlist.")
                    ErrorStatusCheck(err)
                })
            }
        }
        return
    }

    async function onConfirmFunction(seAddTracks) {

        if(!title||title==='') {
            setToast(true, "Non è stato Possibile Creare la playlist: inserire un titolo.")
            return
        }

        let id = null
        
        try {
            const data = await spotifyApi.createPlaylist(title, {description: description, public: isPublic})
            id = data.body.id
            console.log(data)
            await addingImage(data.body.id)
            let addedPlaylist = {
                image: image ? URL.createObjectURL(image) : null,
                name: data.body.name,
                description: description,
                id: data.body.id,
                ownerId: data.body.owner.id,
                ownerName: data.body.owner.display_name,
                public: data.body.public,
                totalTracks: data.body.tracks.total,
                uri: data.body.uri}
            
            if (seAddTracks==="ADDTRACKS") {
                addPlaylistInStorage(addedPlaylist)
            } else {
                addPlaylist(addedPlaylist)
                setToast(true, "Playlist creata con Successo!")
                onClose() 
            }

        } catch (err) {
            setToast(true, "Non siamo riusciti a creare la nuova playlist.")
            ErrorStatusCheck(err)
        }
    }

    function addPlaylistInStorage(playlist){

        //in questo caso rimuovo il blob image perchè scadrebbe passando alla prossima pagina, 
        //gli assegno un valore speciale per marcare che qui dovrebbe esserci un immagine ma non c'è e richiederla in seguito
        //questo perchè se la richiedessi ora mi verrebbe restituito null, i server api non l'hanno ancora impostata
        //lo stesso accade per la descrizione
        playlist.image = playlist.image ? "ASK" : null

        spotifyApi.getPlaylistTracks(playlist.id)
        .then((tracks) => {
            console.log(tracks)
            const tracce = tracks.body.items.map(traccia=>{
                return traccia.track.id
            })
            localStorage.setItem('createdPlaylistTracks', JSON.stringify(tracce))
            localStorage.setItem("createdPlaylist", JSON.stringify(playlist))

            onClose()

            //REINDIRIZZO ALLA PAGINA DI NAVIGAZIONE PER AGGIUNGERE LE CANZONI
            window.location = "http://localhost:3000/navigate" 
        })
        .catch(e=>{
            ErrorStatusCheck()
        })
    }
}

export default ModalCreatePlaylist