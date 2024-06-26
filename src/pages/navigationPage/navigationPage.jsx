import FooterElement from "../../components/footerElement/footerElement";
import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import { Form, Container, Row, Col, Carousel} from "react-bootstrap";
import PlaylistCardNavigationPage from "../../components/playlistCardNavigationPage/playlistCardNavigationPage"
import PlaylistCardVertical from "../../components/playlistCardVertical/playlistCardVertical"
import TrackCardHorizontal from "../../components/trackCardHorizontal/trackCardHorizontal";
import TrackCardVertical from "../../components/trackCardVertical/trackCardVertical";
import FiltriRicerca from "../../components/filtriRicerca/filtriRicerca";
import Album from "../../components/album/album";
import Artist from "../../components/artist/artist";
import ErrorStatusCheck from '../../util/errorStatusCheck'
import Playlist_list from "../../components/playlist_list/playlist_list";
import { spotifyApi } from '../../util/costanti';




function NavigationPage(){

  //MANTENGO UNO STATE DELL'ACCESS TOKEN, il setter viene passato alla gestione errori e poi a refreshToken, al cambiare dello state rieseguo alcune funzioni_______________________________________________________________________________
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"))


//SHOW FOOTER________________________________________________________________________________________________________________________________________________________________________________________________________________________________
  
     const [showFooter, setShowFooter] = useState(false);
     const [createdPlaylist, setCreatedPlaylist] = useState();

     useEffect(() => {
      if(JSON.parse(localStorage.getItem('createdPlaylist'))) {
        setCreatedPlaylist(JSON.parse(localStorage.getItem('createdPlaylist')))
        setShowFooter(true)
      }
    }, [])


    useEffect(() => {
      if(showFooter) {
        setCreatedPlaylist(JSON.parse(localStorage.getItem('createdPlaylist')))
      } else {
        setCreatedPlaylist(null)
      }
    }, [showFooter])


//LIMITE DI RICERCA____________________________________________________________________________________________________________________________________________________________________________________________________________________________

const [searchLimit, setSearchLimit] = useState(5) //viene modificato con il componente filtri di ricerca



//IMPOSTAZIONI DI RICERCA_______________________________________________________________________________________________________________________________________________________________________________________________________________________

//categoria playlist 
  const [optionCategory, setOptionCategory] = useState("");
//  //cosa cercare
   const [filterArr, setFilterArr] = useState([true, true, true, true])  //questo serve per contenere un array di 4 posizioni booleane, 0 playlist, 1 canzoni, 2 albums, 3 artists. TRUE per cercare, FALSE per non cercare

  const [searchWord, setSearchWord] = useState('')
  const [searchResultPlaylists, setSearchResultPlaylists] = useState()
  const [searchResultAlbums, setSearchResultAlbums] = useState()
  const [searchResultArtists, setSearchResultArtists] = useState()
  const [searchResultTracks, setSearchResultTracks] = useState()



  useEffect(() => {
    if (searchWord && searchWord!=='') {
      ricerca()
      //SPOTIFY OPERA CON UN TIPO DI RICERCA FUZZY, CIO' SIGNIFICA CHE CERCA SEMPRE DI MATCHARE I RISULTATI MIGLIORI, 
      //NON è UNA RICERCA ESATTA, QUINDI SE INSERIAMO GENERE, NOME, TAG, ANNO, O ALTRO VIENE AUTOMATICAMENTE CERCATO UN RISULTATO COMPATBILE
      //HO PROVATO A FILTRARE LE RICERCHE IN MODO PIU' PRECISO, AD ESEMPIO CON LE OPZIONI: //{genre: searchWord, limit : searchLimit, exact: true}
      //TUTTAVIA LA RICERCA NON E' PRECISA, CERCA ANCORA IN MODO FUZZY, QUINDI NON HA SENSO INSERIRE UNO SWITCH CHE SPECIFICA SECONDO QUALE CRITERIO CERCARE
      //ho provato anche ad inviare la richiesta con il campo option category_id attivo ma la ricerca pur funzionando dava gli stessi risultati
    } else {
      setSearchResultPlaylists(null)  
      setSearchResultTracks(null)       //se la searchWord si svuota riporto a null
      setSearchResultAlbums(null)
      setSearchResultArtists(null)
    }
  },[searchWord, showFooter, filterArr, searchLimit])



//FUNZIONE DI RICERCA _________________________________________________________________________________________________________________________________________________________________________________________________________________________________

function ricerca(){

    if(filterArr[0]) {

      spotifyApi.searchPlaylists(searchWord, { limit : searchLimit})
      .then(result => {
        const playlists = result.body.playlists.items.map(item => {                                //ricerca playlist
          return {
            image: item.images && item.images.length > 0 ? item.images[0].url : null,
            name: item.name,
            description: item.description ? item.description : null,
            id: item.id,
            ownerId: item.owner.id,
            ownerName: item.owner.display_name,
            totalTracks: item.tracks.total,
            uri: item.uri,
          }
        })
        console.log("playlists", playlists)  
        setSearchResultPlaylists(playlists)
      })
      .catch(err => {
        ErrorStatusCheck(err)
    })
    }

  //ricerca canzoni
  if(filterArr[1]) {
    spotifyApi.searchTracks(searchWord, { limit : searchLimit})
    .then(result => {
      const tracks = result.body.tracks.items.map(item => {
        const duration = new Date(item.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
        return {
          image: item.album.images[0].url,
          name: item.name,
          album: item.album.name,
          duration: duration,
          id: item.id,
          releaseDate: item.album.release_date,                                                   //ricerca canzoni 
          artists: item.artists.map(artist => artist.name),
          artistsId: item.artists.map(artista => artista.id),
          uri: item.uri,
        }
      })
      console.log("Tracks", tracks)                
      setSearchResultTracks(tracks)
    })
    .catch(err => {
      ErrorStatusCheck(err)
  })
  }       

  //ricerca album
  if (filterArr[2]) {
    spotifyApi.searchAlbums(searchWord, { limit : searchLimit})
    .then(result => {
      //console.log("ALBUM_____", result)
      const albums = result.body.albums.items.map(item => {                                       
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          id: item.id,
          releaseDate: item.release_date,
          artists: item.artists.map(artist => artist.name),                                       //ricerca album
          artistId: item.artists[0].id,
          uri: item.uri,    
          totalTracks: item.total_tracks
        }
      })
      console.log("Albums:", albums)
      setSearchResultAlbums(albums)       
    })
    .catch(err => {
      ErrorStatusCheck(err)
  })
  }
  //ricerca Artisti
  if (filterArr[3]) {

    let newLimit
    searchLimit%5===0 ? newLimit=searchLimit :  newLimit = Math.ceil(searchLimit/5)*5   //divido per 5, arrotondo per eccesso, moltiplico per 5 per avere un numero di pagine con pagine sempre complete (ad esempio se searchLimit è 24 lo faccio diventare 25)
                                                                                        //lo faccio per mantenere il carosello semnza buchi sempre pieno 
    spotifyApi.searchArtists(searchWord, {  limit : newLimit})
    .then(result => {
      const artists = result.body.artists.items.map(item => {                                     //ricerca artisti  
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          id: item.id,
          followers: item.followers.total,
          uri: item.uri,    
          genres: item.genres,

        }
      })
      console.log("Artists:", artists)
      
      let newArtists = []
      while (artists.length > 0) {
        newArtists.push(artists.slice(0, 5))    //divido artist 5 elementi alla volta e li pusho nell'array newartists per creare un array di array
        artists.splice(0, 5)
      }

      setSearchResultArtists(newArtists)

    })                                                                 
    .catch(err => {
      ErrorStatusCheck(err)
  })
  } 
//}
}


//RICERCA PLAYLIST PER CATEGORIA _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  useEffect(() => {

    if(searchWord&&searchWord!==""&&optionCategory!=="") {
      setSearchWord("")
    }

    if (optionCategory&&optionCategory!=="") {
        
      //ricerca playlist tramite categoria:
      spotifyApi.getPlaylistsForCategory(optionCategory, {  limit : searchLimit})
      .then(result => {
        const playlists = result.body.playlists.items.map(item => {                                       //ricerca playlist
          return {
            image: item.images && item.images.length > 0 ? item.images[0].url : null,
            name: item.name,
            description: item.description ? item.description : null,
            id: item.id,
            ownerId: item.owner.id,
            ownerName: item.owner.display_name,
            totalTracks: item.tracks.total,
            uri: item.uri,
          }
        })
        console.log("playlists", playlists)  
        setSearchResultPlaylists(playlists)
      })
      .catch(err => {
        ErrorStatusCheck(err)
      })

    }
  }, [optionCategory, filterArr[0], searchLimit])


  //GET TOP PLAYLISTS & TRACKS__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  const [topPlaylists, setTopPlaylists] = useState()
  const [topTracks, setTopTracks] = useState()  

  function getTop() {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    if (!currentUser) return
    
    spotifyApi.getFeaturedPlaylists({ limit: 10, offset: 0, country: currentUser.country })
    .then(result => {
      const topPlaylists = result.body.playlists.items.map(item => {   //ricevo e ciclo su una map di items
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          description: item.description ? item.description : null,
          id: item.id,
          ownerId: item.owner.id,
          ownerName: item.owner.display_name,
          uri: item.uri,
        }
      })
      setTopPlaylists(topPlaylists)
      console.log("Top 10 Spotify Playlists",topPlaylists)
    })
    .catch(err => {
      ErrorStatusCheck(err, setAccessToken)
  })


  //per ottenere i brani più popolari non c'è una chiamata specifica, quindi chiedo i primi 10 brani della playlist top 50 italia oppure se l'utente non è italiano uso top 50 globale
  let playlistOfTop50 = null
  if (currentUser.country === 'IT') {
    playlistOfTop50 = '37i9dQZEVXbIQnj7RRhdSX'  //id playlist top 50 italia
  } else {
    playlistOfTop50 = '37i9dQZEVXbMDoHDwVN2tF'  //id playlist top 50 global
  }
  spotifyApi.getPlaylistTracks(playlistOfTop50, {limit: 10, offset: 0})
  .then(res => {
    const currentTopTracks = res.body.items.map((item, index) => {
      return {
        image: item.track.album.images[0].url,
        name: item.track.name,
        album: item.track.album.name,
        id: item.track.id,
        releaseDate: item.track.album.release_date,
        artists: item.track.artists.map(artist => artist.name),
        artistsId: item.track.artists.map(artista => artista.id),
        uri: item.track.uri,
        index: index+1
      }})
      setTopTracks(currentTopTracks)
      console.log("Top 10 Spotify Tracks",currentTopTracks)
    }) 
    .catch(err => {
      ErrorStatusCheck(err, setAccessToken)
  })
 
}

useEffect(() => {
  if (searchWord === "" || !searchWord) {
    getTop()
    getMyTopTracksFunction()
  }
}, [searchWord, accessToken])



//GET MY TOP TRACKS______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

const [myTopTracks, setMyTopTracks] = useState()
const [my50topTracks, setMy50topTracks] = useState()

function getMyTopTracksFunction() {
  spotifyApi.getMyTopTracks({limit: 10, offset: 0})
  .then(res=>{
    const myCurrentTopTracks = res.body.items.map((item, index) => {
      const duration = new Date(item.duration_ms).toISOString().slice(14, 19);
      return {
        image: item.album.images[0].url,
        name: item.name,
        duration: duration,
        album: item.album.name,
        id: item.id,
        releaseDate: item.album.release_date,
        artists: item.artists.map(artist => artist.name),
        artistsId: item.artists.map(artista => artista.id),
        uri: item.uri,
        index: index+1
      }})

      setMyTopTracks(myCurrentTopTracks)
      console.log('User Top Tracks', myCurrentTopTracks)
    }) 
    .catch(err => {
      ErrorStatusCheck(err, setAccessToken)
  })
}


//RENDERIZZO IL BANNER__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

    if (!localStorage.getItem("accessToken")) {
      return(
        <>
        <div className="wallpaper"> 
          <NavigationBar/>
            <div className="notLoggedBanner container bg-dark opacity-75 d-flex flex-column ">
              <p className="text-light font-weight-bold text-center font-family-verdana text-lg">Attenzione! devi prima accedere a Spotify per visualizzare il contenuto di questa pagina.</p>
              <ButtonLogin text="Accedi con Spotify"/>
            </div>
        </div>
        </>
      )
    }


//RENDERIZZO LA PAGINA___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

    return(
      <>
      <NavigationBar/>

      {/* FORM DI RICERCA */}
        <Container className="search d-flex flex-row ">
          <Form.Control disabled={optionCategory!==""} className="width-100" type="search mb-3" placeholder="Cerca Playlist o Traccia musicale" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
        </Container>

      {/* FILTRI DI RICERCA */}
        <FiltriRicerca changeLimit={(childNumber)=>setSearchLimit(childNumber)} filterArr={filterArr} cosaCercare={(filtriSelezionati)=>setFilterArr(filtriSelezionati)} setOptionCategory={(categoria)=>setOptionCategory(categoria)} activeCategory={optionCategory}/>

      {/* LISTA DELLE PLAYLIST */}
      <Playlist_list showFooter={showFooter} setShowFooter={()=>setShowFooter(true)}></Playlist_list>

        {/* CAROSELLO MY TOP TRACK */}
        {myTopTracks&&(!searchWord||searchWord==="")&&optionCategory===""&&<Container fluid className="cardsTop" >
          <hr/>
            <div><h3>My Top Tracks</h3></div>
            <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                    {myTopTracks.map((myCurrentTrack, index) => (                    
                      index<5 ? <Col><TrackCardVertical currentTrack={myCurrentTrack} key={myCurrentTrack.id} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
              <Row>
                    {myTopTracks.map((myCurrentTrack, index) => (                    
                      index>=5 ? <Col><TrackCardVertical currentTrack={myCurrentTrack} key={myCurrentTrack.id} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
        </Container>}

        {/* CAROSELLO TOP 10 TRACKS SPOTIFY */}
        {topTracks&&(!searchWord||searchWord==="")&&optionCategory===""&&<Container fluid className="cardsTop" >
           <hr/>
           <div><h3>Top 10 Spotify Tracks'</h3></div>
           <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index<5 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index>=5 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id} showFooter={showFooter} currentPlaylist={createdPlaylist}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
          </Container>}

        {/* CAROSELLO TOP 10 PLAYLIST SPOTIFY */}
        {topPlaylists&&(!searchWord||searchWord==="")&&optionCategory===""&&<Container fluid className="cardsTop" >
            <hr/>
            <div><h3>Top 10 Spotify Playlist's</h3></div>
            <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={5000}>
                  <Row>
                    {topPlaylists.map((currentPlaylist, index) => (                    
                        index<5 ? <Col><PlaylistCardVertical playlist={currentPlaylist} key={currentPlaylist.id} showFooter={showFooter} createdPlaylist={createdPlaylist}/></Col> : null
                      ))}
                  </Row>
                </Carousel.Item>
              <Carousel.Item interval={5000}>
                  <Row>
                    {topPlaylists.map((currentPlaylist, index) => (                    
                        index>=5 ? <Col><PlaylistCardVertical playlist={currentPlaylist} key={currentPlaylist.id} showFooter={showFooter} createdPlaylist={createdPlaylist}/></Col> : null
                      ))}
                  </Row>
              </Carousel.Item>
            </Carousel>
        </Container>}
        

        {/* RISULTATI DI RICERCA */}
        <Container style={{marginBottom: localStorage.getItem('createdPlaylist') ? "25vh" : 0}}>
          {/* ARTISTS */}
          {filterArr[3] && searchResultArtists && 
            <div>
                <h4>La ricerca degli Artisti ha prodotto i seguenti risultati:</h4>
                <Carousel indicators={false} controls={false}>
                    {searchResultArtists.map((currentPageArtists, index) => (         
                        <Carousel.Item interval={5000} key={index}>
                            <Row>
                                {currentPageArtists.map((currentArtist) => (
                                    <Col key={currentArtist.id}><Artist artist={currentArtist}/></Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        }
          {/* TRACKS */}
          {filterArr[1]&&searchResultTracks&&<div >
            <hr/>
            <h4>La ricerca delle Tracce ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultTracks.map(currentTrack => (                    
                  <TrackCardHorizontal currentTrack={currentTrack} key={currentTrack.id} showFooter={showFooter} currentPlaylist={createdPlaylist}/>
                ))}
              </div>
            <hr/>
          </div>}
          {/* PLAYLISTS */}
          {filterArr[0]&&searchResultPlaylists&&(searchWord||optionCategory!=="")&&<div >
            <h4>La ricerca delle Playlist ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultPlaylists.map(currentPlaylist => (                    
                  <PlaylistCardNavigationPage playlist={currentPlaylist} key={currentPlaylist.id} showFooter={showFooter} createdPlaylist={createdPlaylist}/>
                ))}
              </div>
            <hr/>
          </div>}
          {/* ALBUMS */}
          {filterArr[2]&&searchResultAlbums&&<div >
            <h4>La ricerca degli Album ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultAlbums.map(currentAlbum => (                    
                  <Album currentAlbum={currentAlbum} key={currentAlbum.id} showFooter={showFooter} createdPlaylist={createdPlaylist}/>
                ))}
              </div>
            <hr/>
          </div>}
        
        </Container>
        
        {/* FOOTER AGGIUNTA CANZONI A PLAYLIST */}
           {showFooter&&createdPlaylist&&<FooterElement close={()=>setShowFooter(false)} playlist={createdPlaylist}></FooterElement>}
      </>
    )
}

export default NavigationPage





