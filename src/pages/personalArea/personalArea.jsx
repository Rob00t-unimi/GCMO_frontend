import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'

import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Pencil, PlusCircle } from 'react-bootstrap-icons';
import ModalCreatePlaylist from "../../components/ModalCreatePlaylist/modalCreatePlaylist";
import fotoProfiloGenerica from '../../assets/fotoProfiloGenericaFullLight.png';
import ModalModifyUser from '../../components/modalModifyUser/modalModifyUser'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import PlaylistCardPersonalArea from "../../components/playlistCardPersonalArea/playlistCardPersonalArea";
import { spotifyApi } from '../../util/costanti';



function PersonalArea() {

  //MANTENGO UNO STATE DELL'ACCESS TOKEN, il setter viene passato alla gestione errori e poi a refreshToken, al cambiare dello state rieseguo alcune funzioni_________________________________________________________
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"))

 
//INIZIALIZZO UN PO' DI STATI_________________________________________________________________________________________________________________________________________________________________________________________

  const [filterName, setFilterName] = useState('ALL')   //nome dei filtri dei button nella pagina personale
  const [modal, setModal] = useState(false)             
  const [userModal, setUserModal] = useState(false)             
  
  const [currentUser, setCurrentUser] = useState();   //dati attuali dell'utente

//RIMUOVO LA PLAYLIST NEL LOCAL STORAGE________________________________________________________________________________________________________________________________________________________________________________

  useEffect(() => {  
    if(localStorage.getItem('createdPlaylist')) {
      localStorage.removeItem('createdPlaylist')
    }
  }, []);

  //ESEGUIRE LE FUNZIONI PRINCIPALI____________________________________________________________________________________________________________________________________________________________________________________

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return;  
    getInfoUtente();
    getAllPlaylist();
  }, [accessToken, userModal])

//OTTENERE INFO UTENTE________________________________________________________________________________________________________________________________________________________________________________________________
 
  function getInfoUtente() {
    if(localStorage.getItem('user')) {
      setCurrentUser(JSON.parse(localStorage.getItem('user')))
      return
    }

    spotifyApi.getMe()
        .then(result => {
            localStorage.setItem('user', JSON.stringify({
                description: result.body.description ? result.body.description : null,
                name: result.body.display_name? result.body.display_name : 'user',
                id: result.body.id,
                image: result.body.images.length > 0 ? result.body.images[0].url : null,
                followers: result.body.followers.total,
                country: result.body.country,
            }))
            console.log("UserInfo", result)
            setCurrentUser(JSON.parse(localStorage.getItem('user')))
        })
        .catch(err => {
          ErrorStatusCheck(err, setAccessToken)
      })
  }

//OTTENERE LE PLAYLIST____________________________________________________________________________________________________________________________________________________________________________________________________________________

  const [playlistResults, setPlaylistResults] = useState([])     //risultato alla chiamata per ottenere le playlist
  const [playlistFiltered, setPlaylistFiltered] = useState([])  //playlist filtrate in base al filtro attuale
  const [update, setUpdate] = useState(false)


  
  async function getAllPlaylist(){

  const limit = 50
  let offset = 0
  let playlistsArr = []

  try {
    while(true) {     //ai fini del progetto va bene ma con le limitazioni di rating di spotify api nella versione gratuita se si fanno molte iterazioni (si hanno 50*x playlists crea errore 429)
    const result = await spotifyApi.getUserPlaylists({limit: limit, offset: offset})   
      playlistsArr = playlistsArr.concat(result.body.items.map(item => {
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          description: item.description ? item.description : null,
          id: item.id,
          ownerId: item.owner.id,
          ownerName: item.owner.display_name,
          public: item.public,
          totalTracks: item.tracks.total,
          uri: item.uri,
        }
      }))
      offset += limit
      if(result.body.next === null){
        break
      }
    }

    setPlaylistResults(playlistsArr)

    setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano


  } catch (err) {
    ErrorStatusCheck(err, setAccessToken)
  }
}

//inserisco tutte le playlist create dall'utente nel local storage________________________________________________________________________________________________________________________________________________________________________

useEffect(() => {
  if(currentUser){
    console.log("Elenco Playlists", playlistResults)
    let onlyMyPlaylists = playlistResults.filter(item => {     
    if (!item) return null                                      
    return item.ownerId === currentUser.id
    });
    localStorage.setItem('playlist_list', JSON.stringify(onlyMyPlaylists));
  }
}, [playlistResults])


//FILTRARE LE PLAYLIST______________________________________________________________________________________________________________________________________________________________________________________________________________________

  useEffect( () => {          //verifico a cosa è uguale filtername e filtro di conseguenza le playlist per mostrare quelle corrette
    switch (filterName) {
      case 'ALL':
        setPlaylistFiltered(playlistResults)
        break;
      case 'PUBLIC':
        setPlaylistFiltered(playlistResults.filter(item => {   
          if (!item) return null              //prendo da playlistResult solo le playlist che rispettano il filtro e le inserisco in playlistFiltered
          return item.public === true && item.ownerId === currentUser.id
        }));
        break;
      case 'PRIVATE':
        setPlaylistFiltered(playlistResults.filter(item => {
          if (!item) return null  
          return item.public === false && item.ownerId === currentUser.id
        }));
        break;
      case 'FOLLOWED':
        setPlaylistFiltered(playlistResults.filter(item => {
          if (!item) return null  
          return item.ownerId !== currentUser.id
        }));
        break;
      default:
        break;
    }
  }, [filterName,  update])  //se cambia il filtro selezionato o il booleano update devo filtrare le playlist


//RICERCA PLAYLIST (solo tra le playlist dell'utente, in locale)_________________________________________________________________________________________________________________________________________________________________

const [searchWord, setSearchWord] = useState('')
const [searchResult, setSearchResult] = useState()

useEffect(() => {
  if (searchWord && searchWord !== "") {
    const filteredPlaylists = playlistFiltered.filter(playlist => {
      return playlist.name.toLowerCase().includes(searchWord.toLowerCase());
    });
    setSearchResult(filteredPlaylists);
  } else {
       setSearchResult(null)
    }
}, [searchWord, playlistFiltered]);


//RIMOZIONE DI UNA PLAYLIST IN LOCALE_____________________________________________________________________________________________________________________________________
function removePlaylist(playlistId) {

  playlistResults.map((playlist, index) => {
    if(playlist&&playlist.id === playlistId){
      setPlaylistResults(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index] = null;
        return newPlaylists
      })
    }
  })

  if(!searchResult){
    setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle 
    return
   }

  searchResult.map((playlist,index)=>{
    if(playlist.id === playlistId){
      setSearchResult(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index] = null;
        return newPlaylists
      })
    }
  })

  setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle
}

//AGGIUNGI UNA PLAYLIST ALL'ELENCO_________________________________________________________________________________________________

function addPlaylist(newPlaylist) {
  setPlaylistResults([newPlaylist, ...playlistResults])
  setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano
}

//MODIFICA VISIBILITA' DI UNA PLAYLIST________________________________________________________________________________________________________________________
function modifyVisibility(playlistId) {
  playlistResults.map((playlist, index) => {
    if(playlist&&playlist.id === playlistId){
      setPlaylistResults(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index].public = !newPlaylists[index].public;
        return newPlaylists
      })
    }
  })

  if(!searchResult){
   setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle 
   return
  }

  searchResult.map((playlist,index)=>{
    if(playlist.id === playlistId){
      setSearchResult(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index].public = !newPlaylists[index].public;
        return newPlaylists
      })
    }
  })

  setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle
}

//MODIFICA COMPLETA DI UNA PLAYLIST_________________________________________________________________________________________________________________________________
function modifySinglePlaylist(playlistId, playlistModificata) {
  playlistResults.map((playlist, index) => {
    if(playlist&&playlist.id === playlistId){
      setPlaylistResults(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index]= playlistModificata;
        return newPlaylists
      })
    }
  })



  if(!searchResult){
    setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle 
    return
   }

   searchResult.map((playlist,index)=>{
    if(playlist&&playlist.id === playlistId){
      setSearchResult(prevPlaylists =>{
        let newPlaylists = [...prevPlaylists];
        newPlaylists[index]= playlistModificata;
        return newPlaylists
      })
    }
  })

  setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano per rifiltrarle
}

//RENDERIZZO IL BANNER__________________________________________________________________________________________________________________________________________________________________________________________________________

  //se non c'è il token restituisco un banner nella pagina personale altrimenti proseguo
  if (!localStorage.getItem("accessToken")){ return(
    <>
    <div className="wallpaper">
      <NavigationBar/>
        <div className="notLoggedBanner container bg-dark opacity-75 d-flex flex-column ">
          <p className="text-light font-weight-bold text-center font-family-verdana text-lg">Attenzione! devi prima accedere a Spotify per visualizzare il contenuto di questa pagina.</p>
          <ButtonLogin text="Accedi con Spotify"/>
        </div>
    </div>
    
    </>
  );}



//RENDERIZZO PERSONAL AREA_________________________________________________________________________________________________________________________________________________________________________________________________________________

  //restituisco la pagina Personale
    return(
      <>
      <NavigationBar/>
      <div className="info"><Row >
        <Col>{currentUser&&<div className="immagineProfilo"><img className="img-fluid" src={currentUser.image ? currentUser.image : fotoProfiloGenerica} alt="immagine profilo"/></div>}</Col>
        <Col className="text-center">
          <div className="nomeUtente img-fluid">
            {currentUser&&<div className="text-center" ><h1>{currentUser.name}</h1></div>}
            {currentUser&&<div className="text-center" ><h3>{currentUser.id}</h3></div>}
            <div className="benvenuto text-center">Benvenuto nella tua Area Personale</div>
            <div className="d-flex flex-row justify-content-center">{currentUser&&<div className="followers text-light text-center">{"Followers: " + currentUser.followers} </div>}
            <Button className="modifica-profilo btn-light" onClick={()=>setUserModal(true)}><Pencil className="pencil"/></Button></div>
          </div>
        </Col>
        <Col></Col>
      </Row></div>
      <div className="wallpaperInfo"></div>
      <div  className="contenuto">
        <Row>
          <Col className="text-end">
            <Button className='crea btn-lg btn-success text-light' onClick={()=>setModal(true)} ><PlusCircle/> Crea</Button>  {/*onlcick stato della modale = true quindi la apro*/}
          </Col>
          <Col className="text-center">
            <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("ALL")} style={{backgroundColor: `${filterName === 'ALL' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Tutte</Button>
            <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PRIVATE")} style={{backgroundColor: `${filterName === 'PRIVATE' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Private</Button>
            <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PUBLIC")} style={{backgroundColor: `${filterName === 'PUBLIC' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Pubblicate</Button>
            <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("FOLLOWED")} style={{backgroundColor: `${filterName === 'FOLLOWED' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Salvate</Button>
          </Col>
          <Col >
            <Form.Control className="searchPersonalArea" type="search" placeholder="Cerca Playlist" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
          </Col>
        </Row>   
        <Container className="playlists">
          {searchResult&&<div >
            <div>La ricerca ha prodotto i seguenti risultati:</div>
            {(searchResult.length===0)&&<div className="text-center">Nessun Risultato</div>}
            <div>
            {searchResult.map((playlist) => (                    
              playlist&&<PlaylistCardPersonalArea playlist={playlist} userInfo={currentUser} setRemovedPlaylist={()=>removePlaylist(playlist.id)} modifyVisibility={()=>modifyVisibility(playlist.id)} modifyPlaylist={(newPlaylist)=>modifySinglePlaylist(playlist.id, newPlaylist)} addPlaylist={(newPlaylist)=>addPlaylist(newPlaylist)}/>
            ))}
            </div>
            <hr/>
            </div>}
          <div>
            {playlistFiltered.map((playlist) => (                     
              playlist&&<PlaylistCardPersonalArea playlist={playlist} userInfo={currentUser} setRemovedPlaylist={()=>removePlaylist(playlist.id)} modifyVisibility={()=>modifyVisibility(playlist.id)} modifyPlaylist={(newPlaylist)=>modifySinglePlaylist(playlist.id, newPlaylist)} addPlaylist={(newPlaylist)=>addPlaylist(newPlaylist)}/>
            ))}
          </div>
        </Container>
      </div>

      {modal&&<ModalCreatePlaylist show={modal} onClose={()=>{setModal(false)}} addPlaylist={(newPlaylist)=>addPlaylist(newPlaylist)}/>}
      {currentUser&&<ModalModifyUser show={userModal} onClose={()=>{setUserModal(false)}} userInfo={currentUser}/>}

      </>
    )
}

export default PersonalArea;




//ci sono un bel po di problemi da rivedere


