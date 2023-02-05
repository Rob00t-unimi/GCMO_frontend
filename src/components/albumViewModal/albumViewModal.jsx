import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Modal, Pagination, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'../general.css'
import'./style.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import { spotifyApi } from '../../util/costanti';
import spotifyLogoMini from "../../assets/SpotifyLogo02.png"
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { ToastContext } from '../../App';



const AlbumViewModal = ({ show, onClose, album, currentUser, showFooter, createdPlaylist}) => {

    const {setToast} = useContext(ToastContext)

    if(!currentUser){
        currentUser = JSON.parse(localStorage.getItem('user'))
    }


//CONTROLLO IL TOKEN________________________________________________________________________________________________________________

 const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

//________________________________________________________________________________________________________________________

const [tracks, setTracks] = useState(null)


//RICHIEDERE OGNI TRACCIA   _______________________________________________________________________________________________________
//le richiedo tutte insieme ciclando poichè a differenza delle playlist difficilmente ci saranno più di 2 iterazioni in un album
//normalmente una iterazione è più che sufficiente

async function getAllTracks() {
    let allTracks = [];
    let offset = 0;
    let limit = 50;
  
    try {
        while (true) {
            let res = await spotifyApi.getAlbumTracks(album.id, { offset, limit });
      
            let tracce = res.body.items.map((trackInfo => {
              const duration = new Date(trackInfo.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
              return {
                  id: trackInfo.id,
                  artists: trackInfo.artists.map(artist => artist.name),  
                  duration: duration,
                  name: trackInfo.name,
                  uri: trackInfo.uri,
              }
          }))

            tracce = await Promise.all(tracce.map(async (item) => {
            const result = await spotifyApi.containsMySavedTracks([item.id])
                return {...item, followed: result.body[0]}
            }))

            allTracks = allTracks.concat(tracce);
        
            if (res.body.next === null) {
              break;
            }
        
            offset += limit;
          }
          console.log(allTracks)
          setTracks(allTracks)
    } catch (err) {
        ErrorStatusCheck(err)
    }
  }
  
  useEffect(() =>{
    getAllTracks()
  }, [])


//RICERCA GENERI_______________________________________________________________________________________________________________

const [artistGenres, setArtistGenres] = useState()

useEffect(() => {

    spotifyApi.getArtists([album.artistId])                         //ricerca artisti
    .then(res=> {
        const generi = res.body.artists.map(artista => {                                       
            return {
              genres: artista.genres.map(item => item)              //estrapolazione generi
            }
          }) 
          console.log(generi)
        const stringaGeneri = generi.map(stringaGenere=>{           
            return stringaGenere.genres.join(', ')                  //metto i generi in un unica stringa
        })
        setArtistGenres(stringaGeneri)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}, [])





//AGGIUNGERE TRACCIA A PLAYLIST SELEZIONATA_________________________________________________________________________________
//se la createdPlaylist non è nel local storage showFooter sarà false e non renderizzo il Btn
//se showFooter è true ma la traccia è già presente nella playlist non renderizzo il Btn 

const [addBtn, setAddBtn] = useState()
const [traccePlaylist, setTraccePlaylist] = useState([])

useEffect(() => {
    
    if(localStorage.getItem('createdPlaylistTracks')) {
        setTraccePlaylist(JSON.parse(localStorage.getItem('createdPlaylistTracks')))
    }
    if(tracks) {
       const newAddbtn = tracks.map((item, index) => {
        return showFooter
    })
    setAddBtn(newAddbtn) 
    }    
}, [showFooter, tracks] )


function addTrack(currentTrack, i){
    if(!tracks) return
    
    spotifyApi.addTracksToPlaylist(createdPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)

        const newAddbtn = tracks.map((item, index) => {
            if(i===index){
                return false
            } else {
                return addBtn[index]
            }
        })
        setAddBtn(newAddbtn)
        setToast(true, "traccia aggiunta correttamente")
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}


//IMPORTARE L'INTERO ALBUM IN UNA PLAYLIST_______________________________________________________________________________________________________
function importaAlbum(){
    const tracce = tracks.map(track => track.uri)
    spotifyApi.createPlaylist(album.name, {public: false})        //limite di canzoni per l'import = 100, tuttavia gli album non hanno quasi mai più di 100 tracce 
    .then(res=>{                                    

        spotifyApi.addTracksToPlaylist(res.body.id, tracce)
        .then(data => {
            setToast(true, "Album importato correttamente.")
            if(window.location.pathname === "/navigate"){
                const newPlaylist = {
                    image: res.body.images && res.body.images.length > 0 ? res.body.images[0].url : null,
                    name: res.body.name,
                    description: res.body.description ? res.body.description : null,
                    id: res.body.id,
                    ownerId: res.body.owner.id,
                    ownerName: res.body.owner.display_name,
                    public: res.body.public,
                    totalTracks: res.body.tracks.total,
                    uri: res.body.uri
                }
                let lista = [newPlaylist];
                        let lista2 = JSON.parse(localStorage.getItem("playlist_list")) || [];
                        lista = [...lista, ...lista2];
                        console.log("lista", lista);
                        localStorage.setItem("playlist_list", JSON.stringify( lista))
                }
        })
        .catch(err => {
            setToast(true, "Non è stato possibile importare l'album.")
            ErrorStatusCheck(err)
            spotifyApi.unfollowPlaylist(res.body.id)
        })
    })
    .catch(err => {
        setToast(true, "Non è stato possibile importare l'album.")
        ErrorStatusCheck(err)
    })

}

//salvare una traccia
function switchFollow(currentTrack, i) {
  
    if (currentTrack.followed) {
      // chiamata per smettere di seguire
      spotifyApi.removeFromMySavedTracks([currentTrack.id])
        .then((res) => {
          setTracks((prevTracks) => {
            let tracce = [...prevTracks];
            tracce[i].followed = false;
            return tracce;
          });
        })
        .catch((err) => {
          ErrorStatusCheck(err);
        });
    } else {
      // chiamata per seguire
      spotifyApi.addToMySavedTracks([currentTrack.id])
        .then((res) => {
            console.log(res)
          setTracks((prevTracks) => {
            let tracce = [...prevTracks];
            tracce[i].followed = true;
            return tracce;
          });
        })
        .catch((err) => {
          ErrorStatusCheck(err);
        });
    }
  }
  

console.log(tracks)


    

    return (
        <>
        <Modal show={show} animation={true} size="xl" centered>
            <Modal.Header className='bg-dark'>
                <Card className="headerCardModalView d-flex flex-row bg-dark text-light"  >
                    <Card.Img className="imgCardModalView" src={album.image?album.image:playlistImage} />
                    <Card.Body>
                        <Card.Title> {album.name} </Card.Title>
                        <div>{album.artists.join(', ')}</div>
                        <div className='d-flex infoModalView'>
                            <div>
                                <div>Release date: {album.releaseDate}</div>
                                {artistGenres&&<div>Generi: <i>{artistGenres.join(', ')}</i></div>}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Button className='btnCloseModal btn-dark' onClick={onClose}>Close</Button>
            </Modal.Header>

            <Modal.Body className='bg-dark'>
                <div style={{ maxHeight: "65vh", overflowY: "auto"}}>

                    <Table hover variant="dark">
                        <tbody>
                            {tracks&&tracks.map((item, index) => {

                                return (
                                    <tr key={item.id} >
                                        <td>
                                            <a href={item.uri} target="_blank" className='btn btn-dark spotifyLinkBtnMini'><img src={spotifyLogoMini} /></a>
                                            {!item.followed&&<Button className='btn-dark' onClick={()=>switchFollow(item, index)}><Heart></Heart></Button>}
                                            {item.followed&&<Button className='btn-dark' onClick={()=>switchFollow(item, index)}><HeartFill></HeartFill></Button>}
                                        </td>
                                        <td>{item.name}</td>
                                        <td><i>{item.artists.join(', ')}</i> </td>
                                        <td> {item.duration}</td>
                                        {(!traccePlaylist.includes(item.id))&&addBtn&&addBtn[index]&&<td><Button className='btn-success' onClick={() => {addTrack(item, index)}}>Add</Button></td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    
                </div>

            </Modal.Body>
            <Modal.Footer className='bg-dark'>
                {window.location.pathname!=="/preferences"&&<Button className='btn-light btnImport' onClick={importaAlbum}>Importa album in una playlist</Button>}
                <a className="spotifyLinkBtn btn btn-success btn-sm" href={album.uri} target="_blank" ><img src={spotifyLogo} /></a>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default AlbumViewModal