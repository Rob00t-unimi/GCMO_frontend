import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import SpotifyWebApi from 'spotify-web-api-node';

import { Button, Container, Form, ListGroup, Modal } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import ModalCreatePlaylist from "../../components/ModalCreatePlaylist/modalCreatePlaylist";
import refreshToken from '../../util/refreshToken'
import Playlist from "../../components/Playlist/playlist";

//Test 
// import immagine from '../../assets/tests/exampleCopertina.jpg'
// import immagine2 from '../../assets/tests/exampleCopertina2.jpg'
// import immagine3 from '../../assets/tests/exampleCopertina3.jpg' 
//


const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});

function PersonalArea() {

  const [filterName, setFilterName] = useState('ALL')   //nome dei filtri dei button nella pagina personale
  const [modal, setModal] = useState(false)             //impostiamo uno stato iniziale alla modale --> false chiusa, true aperta
  const [playlistResult, setPlaylistResults] = useState([])     //risultato alla chiamata per ottenere le playlist
  const [playlistFiltered, setPlaylistFiltered] = useState([])  //playlist filtrate in base al filtro attuale
  const [limit, setLimit] = useState(50)                        //limite di quante playlist max posso chiedere 
  const [update, setUpdate] = useState(false)
  
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));   //dati attuali dell'utente
  const accessToken = localStorage.getItem('accessToken')   //estraggo il token dal local storage


//OTTENERE INFO UTENTE______________________________________________________________________________________________________________________________________________________________________________________________________________________

  useEffect(() => {                 //quando cambia l'access token eseguo lo use effect
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);     //se l'access token non è nullo eseguo la richiesta di informazioni dell'utente e le salvo nel local storage
    spotifyApi.getMe()
        .then(result => {
            console.log(result)
            localStorage.setItem('user', JSON.stringify({
                name: result.body.display_name? result.body.display_name : 'user',
                id: result.body.id,
                image: result.body.images[0].url ? result.body.images[0].url : null,
                followers: result.body.followers.total,
                //country: result.body.country,
            }))
        })
        .catch(err => {
            console.log(err)      //se ci sono stati errori refresho il token
            refreshToken()
        })

  }, [accessToken])

//OTTENERE LE PLAYLIST____________________________________________________________________________________________________________________________________________________________________________________________________________________

  const getAllPlaylist = () => {

    spotifyApi.getUserPlaylists({
      limit: limit
    })
    .then(result => {
      console.log(result)
        const playlists = result.body.items.map(item => {   //ricevo e ciclo su una map di items
          return {
            image: item.images && item.images.length > 0 ? item.images[0].url : null,
            name: item.name,
            description: item.description ? item.description : null,
            id: item.id,
            ownerId: item.owner.id,
            ownerName: item.owner.display_name,
            public: item.public,

          }
        })
        setPlaylistResults(playlists)
        setPlaylistFiltered(playlists)   //inserisco tutte le playlist nella sezione playlist filtered (non sono ancora filtrate)
        setUpdate(!update)  //le playlist sono state aggiornate, cambio il valore booleano
      })
      .catch(err => {
        console.log("ciao")
        console.log(err)
        refreshToken()
      })
  }

  useEffect(() => {  
    getAllPlaylist()
  }, []);

//FILTRARE LE PLAYLIST______________________________________________________________________________________________________________________________________________________________________________________________________________________

  useEffect( () => {          //verifico a cosa è uguale filtername e filtro di conseguenza le playlist per mostrare quelle corrette
    switch (filterName) {
      case 'ALL':
        getAllPlaylist()    //le richiedo tutte 
        break;
      case 'PUBLIC':
        setPlaylistFiltered(playlistResult.filter(item => {                 //prendo da playlistResult solo le playlist che rispettano il filtro e le inserisco in playlistFiltered
          return item.public === true && item.ownerId === currentUser.id
        }));
        break;
      case 'PRIVATE':
        setPlaylistFiltered(playlistResult.filter(item => {
          return item.public === false && item.ownerId === currentUser.id
        }));
        break;
      case 'FOLLOWED':
        setPlaylistFiltered(playlistResult.filter(item => {
          return item.ownerId !== currentUser.id
        }));
        break;
      default:
        break;
    }
  }, [filterName, update])  //se cambia il filtro selezionato o il booleano update devo filtrare le playlist

//RICERCA PLAYLIST_________________________________________________________________________________________________________________________________________________________________________________________________________________________

const [searchWord, setSearchWord] = useState('')
const [searchResult, setSearchResult] = useState()

useEffect(() => {
  if (searchWord && searchWord!=='') {
     spotifyApi.searchPlaylists(searchWord, {limit: 5})
     .then(result => {
      console.log(result)
      const list = result.body.playlists.items.map(item => {   //ricevo e ciclo su una map di items
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          description: item.description ? item.description : null,
          id: item.id,
          ownerId: item.owner.id,
          ownerName: item.owner.display_name,
          public: item.public ? item.public : null,
        }
      })
      setSearchResult(list)
      console.log(list)
  })
} else {
  setSearchResult(null)
}
},[searchWord])

//METODO PER AGGIORNARE LE PLAYLIST________________________________________________________________________________________________________________________________________________________________________________

const updatePlaylists = () => {
  getAllPlaylist()                  //passo la funzione agli altri livelli, quando un livello la chiama vengono richieste le playlist nuove, all'interno di getAllPlaylist viene cambiato update quindi vengono anche filtrate 
}

//BANNER______________________________________________________________________________________________________________________________________________________________________________________________________________________

  //se non c'è il token restituisco un banner nella pagina personale altrimenti proseguo
  if (!accessToken){ return(
    <>
    <NavigationBar/>
    <div className="notLoggedBanner container bg-dark opacity-75 d-flex flex-column ">
      <p className="text-light font-weight-bold text-center font-family-verdana text-lg">Attenzione! devi prima accedere a Spotify per visualizzare il contenuto di questa pagina.</p>
    <ButtonLogin text="Accedi con Spotify"/>
    </div>
    </>
  );}

//PERSONAL AREA_________________________________________________________________________________________________________________________________________________________________________________________________________________

  //restituisco la pagina Personale
    return(
      <>
      <NavigationBar/>
      <div className="infoUser d-flex flex-row">
        {currentUser&&<div className="immagineProfilo"><img src={currentUser.image} alt="immagine profilo"/></div> }
        <div className="nomeUtente">
        {currentUser&&<div className="text-center" >{currentUser.name}</div>}
          <div className="benvenuto text-center">Benvenuto nella tua Area Personale</div>
          {currentUser&&<div className="followers text-light text-center">{"Followers: " + currentUser.followers} </div>}
        </div>
      </div>
      <div className="contenuto">
        <div className=" d-flex justify-content-end">
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("ALL")} style={{backgroundColor: `${filterName === 'ALL' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Tutte</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PRIVATE")} style={{backgroundColor: `${filterName === 'PRIVATE' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Private</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PUBLIC")} style={{backgroundColor: `${filterName === 'PUBLIC' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Pubblicate</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("FOLLOWED")} style={{backgroundColor: `${filterName === 'FOLLOWED' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Salvate</Button>
          <Form.Control className="search" type="search mb-3" placeholder="Cerca Playlist" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
          <Button className='btn-lg btn-success text-light' onClick={()=>setModal(true)}><PlusCircle/> Crea</Button>  {/*onlcick stato della modale = true quindi la apro*/}
        </div>   
        <Container className="playlists">
          {searchResult&&<div >
            <div>La ricerca ha prodotto i seguenti risultati:</div>
            <div>
            {searchResult.map(playlist => (                    
              <Playlist playlist={playlist}/>
            ))}
            </div>
            <hr/>
            </div>}
          <div>
            {playlistFiltered.map((playlist, index) => (                     //renderizzo ogni plaaylist nella lista filtered Playlist (simile forEach)
              <Playlist playlist={playlist} updatePlaylists={updatePlaylists} /*updatePlaylists={()=>setUpdatePlaylists(!updatePlaylists)}*//>
            ))}
          </div>
        </Container>
      </div>

      {/*passo lo stato di modal alla modale e la funzione per cambiarlo in false*/}
      <ModalCreatePlaylist show={modal} onClose={()=>{setModal(false)}}/>

      </>
    )
}

export default PersonalArea;




//ci sono un bel po di problemi da rivedere