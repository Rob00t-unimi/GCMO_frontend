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
//import Playlist from "../../components/playlist/Playlist";



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
  
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));   //dati attuali dell'utente
  const accessToken = localStorage.getItem('accessToken')   //estraggo il token dal local storage

//______________________________________________________________________________________________________________________________________________________________________________________________________________________

  useEffect(() => {                 //quando cambia l'access token eseguo lo use effect
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);     //se l'access token non è nullo eseguo la richiesta di informazioni dell'utente e le salvo nel local storage
    
    spotifyApi.getMe()
        .then(result => {
            console.log(result)
            localStorage.setItem('user', JSON.stringify({
                name: result.body.display_name? result.body.display_name : 'user',
                id: result.body.id,
                image: result.body.images[0].url? result.body.images[0].url : null,
                followers: result.body.followers.total,
                country: result.body.country,
            }))
        })
        .catch(err => {
            console.log(err)      //se ci sono stati errori refresho il token
            refreshToken()
        })

  }, [accessToken])

  //funzione per ottenere le playlist
  const getAllPlaylist = () => {
    spotifyApi.getUserPlaylists({
      limit: limit
    })
    .then(result => {
      console.log(result)
        const playlist = result.body.items.map(item => {
          return {
            image: item.images[0].url,
            name: item.name,
            description: item.description,
            id: item.id,
            ownerId: item.owner.id,
            ownerName: item.owner.display_name,
            public: item.public,
          }
        })
        setPlaylistResults(playlist)
        setPlaylistFiltered(playlist)   //inserisco tutte le playlist nella sezione playlist filtered (non sono ancora filtrate)
      })
      .catch(err => {
        console.log(err)
        refreshToken()
      })
  }

//______________________________________________________________________________________________________________________________________________________________________________________________________________________

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
  }, [filterName])




//______________________________________________________________________________________________________________________________________________________________________________________________________________________


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


  //restituisco la pagina Personale
    return(
      <>
      <NavigationBar/>
      <div className="infoUser d-flex ">
      {currentUser && <div className="immagineProfilo"><img src={currentUser.image} alt="immagine profilo"/></div> }
        <div><p className="text-light text-align-center">scrivere qui tutte le variabili con le info etc... continuare da qui....</p></div>
      </div>
      <div className="contenuto">
        <div className=" d-flex justify-content-end">
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("ALL")} style={{backgroundColor: `${filterName === 'ALL' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Tutte</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PRIVATE")} style={{backgroundColor: `${filterName === 'PRIVATE' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Private</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("PUBLIC")} style={{backgroundColor: `${filterName === 'PUBLIC' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Pubblicate</Button>
          <Button className="filter btn-lg btn-light text-light" onClick={() => setFilterName("FOLLOWED")} style={{backgroundColor: `${filterName === 'FOLLOWED' ? '#429baa' : 'rgb(196, 199, 197)'}`}}>Salvate</Button>
          <Form.Control className="search" type="search mb-3" placeholder="Cerca Playlist" />
          <Button className='btn-lg btn-success text-light' onClick={()=>setModal(true)}><PlusCircle/> Crea</Button>  {/*onlcick stato della modale = true quindi la apro*/}
        </div>   
      </div>

      {/*passo lo stato di modal alla modale e la funzione per cambiarlo in false*/}
      <ModalCreatePlaylist show={modal} onClose={()=>{setModal(false)}}/>

      <Container>
        <div>
          {/*playlistFiltered.map(playlist => (                     //renderizzo ogni plaaylist nella lista filtered Playlist
            <Playlist playlist={playlist} key={playlist.id}/>
          ))*/}
        </div>
      </Container>

      </>
    )
}

export default PersonalArea;