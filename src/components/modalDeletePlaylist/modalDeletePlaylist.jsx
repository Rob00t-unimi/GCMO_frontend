import SpotifyWebApi from 'spotify-web-api-node';
import {Modal, Button } from 'react-bootstrap'
import { useEffect } from 'react';
import ErrorStatusCheck from '../../util/errorStatusCheck'

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});

function ModalDeletePlaylist({show, onClose, playlist, updatePlaylists}) {
   
    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])


        

    

    function deletePlaylist() {

        // if(playlist.ownerId !== userInfo.id) {
        //     //spotifyApi.
        // }

        // //NON SI PUO' ELIMINARE UNA PLAYLIST SU SPOTIFY TRAMITE API QUINDI
        // //svuoto e contrassegno le playlist eliminate per riconoscerle quando faccio una get e non visualizzarle


        // //richiedo tutti i brani della playlist e salvo solo gli URI
        // let tracks
        // spotifyApi.getPlaylistTracks(playlist.id)
        // .then(res => {
        //         tracks = res.body.items.map((trackInfo => {
        //             return {
        //                 uri: trackInfo.track.uri
        //             }
        //         }))
        //         //elimino tutti i brani della playlist
        //         if (tracks.length > 0) {
        //             spotifyApi.removeTracksFromPlaylist(playlist.id, tracks)
        //             .catch(e => {
        //             console.log( e.response.status);
        //             if (e.response.status === 401 || e.response.status === 403) {
        //                 refreshToken()
        //             }
        //             })
        //         }
        // })
        // .catch(e => {
        //     console.log( e.response.status);
        //     if (e.response.status === 401 || e.response.status === 403) {
        //         refreshToken()
        //     }
        // })

        

        // //cambio i dettagli della playlist per contrassegnarla come eliminata
        // spotifyApi.changePlaylistDetails(playlist.id, {name: "[DELETED] by GCMO", description: "[DELETED] by GCMO", public: false})
        // .then(res => {
        //     alert("Playlist Eliminata")
        //     onClose()
        // })
        // .catch(e => {
        //     console.log( e.response.status);
        //     if (e.response.status === 401 || e.response.status === 403) {
        //         refreshToken()
        //     }
        // })



         //chiamata per smettere di seguire = cancellare (spotify non rimuove veramente le playlist quindi non c'è nemmeno una chiamata per farlo)   
         spotifyApi.unfollowPlaylist(playlist.id)
         .then(res=>{
             updatePlaylists()
             alert("Playlist Eliminata")
             onClose()
         })
         .catch(err => {
            ErrorStatusCheck(err)
        })
     }




    return (
        <Modal show={show} centered>
            <Modal.Body>
                Sei sicuro di voler eliminare questa Playlist?
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={deletePlaylist}>Si</Button>
                <Button className='btn-light' onClick={onClose}>No</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeletePlaylist