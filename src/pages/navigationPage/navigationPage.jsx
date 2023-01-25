import FooterElement from "../../components/footerElement/footerElement";
import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import { Form, Container, Row, Col, Carousel} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import Playlist2 from "../../components/playlist-2/playlist-2"
import Playlist3 from "../../components/playlist-3/playlist-3"
import Track from "../../components/Track/track";
import Track2 from "../../components/track2/track2";
import FiltriRicerca from "../../components/filtriRicerca/filtriRicerca";
import Album from "../../components/album/album";
import Artist from "../../components/artist/artist";
import ErrorStatusCheck from '../../util/errorStatusCheck'



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});







function NavigationPage(){

//CONTROLLO IL TOKEN e lo passo all'oggetto spotifyApi____________________________________________________________________________________

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

//SHOW FOOTER______________________________________________________________________________________________________________________________
  
     const [showFooter, setShowFooter] = useState();

     useEffect(() => {
      if(localStorage.getItem("createdPlaylist")) {
        setShowFooter(true)
      }
    }, [])

//REMOVE CREATED PLAYLIST FROM LOCAL STORAGE_______________________________________________________________________________________________

useEffect(() => {
  if(showFooter===false) {
    localStorage.removeItem('createdPlaylist')
  }
}, [showFooter])























 //RICERCA______________________________________________________________________________________________________________________

//  //cosa cercare
   const [filterArr, setFilterArr] = useState([true, true, true, true])  //questo serve per contenere un array di 4 posizioni booleane, 0 canzoni, 1 playlists, 2 albums, 3 artists. TRUE per cercare, FALSE per non cercare
// //come cercare
//   const [searchFilter, setSearchFilter] = useState("TITLE")
// //per quali cose è consentita la ricerca
//   const [isAllowed, setIsAllowed] = useState([true, true, true, true]) 

// //selezione dei filtri dell'utente
//   const [userSelection, setUserSelection] = useState([true, true, true, true])

  const [searchWord, setSearchWord] = useState('')
  const [searchResultPlaylists, setSearchResultPlaylists] = useState()
  const [searchResultAlbums, setSearchResultAlbums] = useState()
  const [searchResultArtists, setSearchResultArtists] = useState()
  const [searchResultTracks, setSearchResultTracks] = useState()

  const [filtriPerChiamata, setFiltriPerChiamata] = useState(undefined)


  // function impostaFiltroDiRicerca(){
  //   let copy = filterArr
  //   for(let i=0; i<4; i++){
  //     if(userSelection[i]===isAllowed[i]===true) {
  //       copy[i]=true
  //     } else {
  //       copy[i]=false
  //     }
  //   }
  //   setFilterArr(copy)
  // }


  useEffect(() => {
    if (searchWord && searchWord!=='') {
      ricerca()
      // console.log("filtro attivo: ", searchFilter)
      //  switch (searchFilter) {                                                  //SPOTIFY OPERA CON UN TIPO DI RICERCA FUZZY, CIO' SIGNIFICA CHE CERCA SEMPRE DI MATCHARE I RISULTATI MIGLIORI, 
      //        case 'TITLE':                                                      //NON è UNA RICERCA ESATTA, QUINDI SE INSERIAMO GENERE, NOME, TAG, ANNO, O ALTRO VIENE AUTOMATICAMENTE CERCATO UN RISULTATO COMPATBILE
      //           setIsAllowed([true, true, true, true])                          //HO PROVATO A FILTRARE LE RICERCHE IN MODO PIU' PRECISO, AD ESEMPIO CON LE OPZIONI: //{genre: searchWord, limit : searchLimit, exact: true}
      //           impostaFiltroDiRicerca()                                        //TUTTAVIA LA RICERCA NON E' PRECISA, CERCA ANCORA IN MODO FUZZY, QUINDI NON HA SENSO INSERIRE UNO SWITCH CHE SPECIFICA SECONDO QUALE CRITERIO CERCARE
      //           console.log(filterArr)
      //           ricerca()
      //         break;
                
      //       case 'ARTIST':
      //         setIsAllowed([true, false, true, true]) //il filtro artista può essere usato solo per la ricerca di canzoni, album, e artisti
      //         impostaFiltroDiRicerca()
      //         console.log(filterArr)
      //         //impostare filtri 
      //         ricerca()
                
      //         break;

      //       case 'TAG':
      //         setIsAllowed([false, false, false, false]) //il filtro genere può essere usato solo per la ricerca di canzoni e artisti
      //         impostaFiltroDiRicerca()
      //         console.log(filterArr)
      //         //impostare filtri 
      //           //ricercaPerTag()
      //         break;

      //       case 'GENERE':
      //         setIsAllowed([true, false, false, true]) //il filtro genere può essere usato solo per la ricerca di canzoni e artisti
      //         impostaFiltroDiRicerca()
      //         console.log(filterArr)
      //         //impostare filtri 
      //         ricerca()
      //         break;
          
      //       default:
      //         break;
      //     }
    } else {
      setSearchResultPlaylists(null)  
      setSearchResultTracks(null)       //se la searchWord si svuota riporto a null
      setSearchResultAlbums(null)
      setSearchResultArtists(null)
    }
  },[searchWord, showFooter])



//RICERCA PER NOME_______

function ricerca(){
  //ricerca canzoni
  if(filterArr[0]) {
    spotifyApi.searchTracks(searchWord, { limit : searchLimit})    //{genre: searchWord, limit : searchLimit, exact: true}
    .then(result => {
      console.log("result1", result)
      const tracks = result.body.tracks.items.map(item => {
        return {
          image: item.album.images[0].url,
          name: item.name,
          album: item.album.name,
          id: item.id,
          releaseDate: item.album.release_date,                                 //ricerca canzoni 
          artists: item.artists.map(artist => artist.name),
          artistsId: item.artists.map(artista => artista.id),
          uri: item.uri,
        }
      })
      console.log("traccia", tracks)                
      setSearchResultTracks(tracks)
    })
    .catch(err => {
      ErrorStatusCheck(err)
  })
  }       
  //ricerca playlist
  if(filterArr[1]) {
    spotifyApi.searchPlaylists(searchWord, { limit : searchLimit})
    .then(result => {
      const playlists = result.body.playlists.items.map(item => {                                       //ricerca playlist
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          description: item.description ? item.description : null,
          id: item.id,
          ownerId: item.owner.id,
          ownerName: item.owner.display_name,
        }
      })
      console.log("playlists", playlists)  
      setSearchResultPlaylists(playlists)
    })
    .catch(err => {
      ErrorStatusCheck(err)
  })
  }
  //ricerca album
  if (filterArr[2]) {
    spotifyApi.searchAlbums(searchWord, { limit : searchLimit})
    .then(result => {
      console.log("ALBUM_____", result)
      const albums = result.body.albums.items.map(item => {                                       
        return {
          image: item.images && item.images.length > 0 ? item.images[0].url : null,
          name: item.name,
          id: item.id,
          releaseDate: item.release_date,
          artists: item.artists.map(artist => artist.name),                                       //ricerca album
          uri: item.uri,    
        }
      })
      console.log("albums", albums)
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
    spotifyApi.searchArtists(searchWord, {  limit : searchLimit})
    .then(result => {
      console.log("DATI ARTISTI",result)
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
      console.log("artists", artists)
      
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
}



















  //GET TOP PLAYLIST_____________________________________________________________________________________________________________

  const [topPlaylists, setTopPlaylists] = useState()
  const [topTracks, setTopTracks] = useState()
    

  function getTop() {
    const currentUser = JSON.parse(localStorage.getItem('user'))
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
          
        }
      })
      setTopPlaylists(topPlaylists)
    })
    .catch(err => {
      ErrorStatusCheck(err)
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
    console.log("problema", res)
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
      
    }) 
    .catch(err => {
      ErrorStatusCheck(err)
  })
 
}

useEffect(() => {
  if (searchWord === "" || !searchWord) {
    getTop()
    console.log('top tracks', topTracks)
    console.log('top playlist', topPlaylists)
    getMyTopTracksFunction()
    console.log('my top', myTopTracks)
  }
}, [searchWord])

//GET MY TOP TRACKS_______________________________________________________________________________________________________________________________________________________________________________________

const [myTopTracks, setMyTopTracks] = useState()

function getMyTopTracksFunction() {
  spotifyApi.getMyTopTracks({limit: 10, offset: 0})
  .then(res => {
    console.log("MY TOP", res)
    const myCurrentTopTracks = res.body.items.map((item, index) => {
      return {
        image: item.album.images[0].url,
        name: item.name,
        album: item.album.name,
        id: item.id,
        releaseDate: item.album.release_date,
        artists: item.artists.map(artist => artist.name),
        artistsId: item.artists.map(artista => artista.id),
        uri: item.uri,
        index: index+1
      }})

      setMyTopTracks(myCurrentTopTracks)
      
    }) 
    .catch(err => {
      ErrorStatusCheck(err)
  })
}


 //PLAYLIST CONSIGLIATE ___________________________________________________________________________________________________________________________________________________________________________________

// function getPlaylistConsigliate(){
//   //chiedo la lista di generi consigliati per l'utente 
//   spotifyApi.getAvailableGenreSeeds()
//   .then(res => {
//       console.log("generiConsigliati", res)
//       const generiConsigliati = res
//       //chiedo le raccomandazioni
//       spotifyApi.getRecommendations({ min_energy: 0.4, seed_genres: generiConsigliati, min_popularity: 50 })
//       .then(data => {
//         console.log("raccomandazioni", data)
//       }) 
//       .catch(e => {
//         console.log("erroreRaccomandazioni", e)
//         if (e.response.status === 401 || e.response.status === 403) {
//             refreshToken()
//         }
//       })
//     }) 
//   .catch(e => {
//     console.log("errore", e)
//     if (e.response.status === 401 || e.response.status === 403) {
//         refreshToken()
//     }
//   })
// }


//LIMITE DI RICERCA_______________________________________________________________________________________________________________________________________________________________________________________

const [searchLimit, setSearchLimit] = useState(5) //viene modificato con il componente filtri di ricerca


//RENDERIZZO IL BANNER____________________________________________________________________________________________________________________________________________________________________________________

    if (!(localStorage.getItem("accessToken"))||(localStorage.getItem("accessToken")==="undefined")) {
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

//RENDERIZZO LA PAGINA____________________________________________________________________________________________________________________________________________________________________________________

    return(
      <>
      <NavigationBar/>

      {/* FORM DI RICERCA */}
        <Container className="search d-flex flex-row">
          <Form.Control className="width-100" type="search mb-3" placeholder="Cerca Playlist o Traccia musicale" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
        </Container>

      {/* FILTRI DI RICERCA */}
        <FiltriRicerca changeLimit={(childNumber)=>setSearchLimit(childNumber)} filterArr={filterArr} /*isAllowed={isAllowed} userSelection={userSelection}*/ cosaCercare={(filtriSelezionati)=>setFilterArr(filtriSelezionati)/*(filtriSelezionati)=>setUserSelection(filtriSelezionati)*/} /*comeCercare={(newFilter)=>{setSearchFilter(newFilter)}}*/></FiltriRicerca>

        {/* CAROSELLO MY TOP TRACK */}
        {myTopTracks&&(!searchWord||searchWord==="")&&<Container fluid className="cardsTop" >
          <hr/>
            <div><h3>My Top Tracks</h3></div>
            <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                    {myTopTracks.map((myCurrentTrack, index) => (                    
                      index<5 ? <Col><Track2 currentTrack={myCurrentTrack} key={myCurrentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
              <Row>
                    {myTopTracks.map((myCurrentTrack, index) => (                    
                      index>=5 ? <Col><Track2 currentTrack={myCurrentTrack} key={myCurrentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
        </Container>}

        {/* CAROSELLO TOP 10 TRACKS SPOTIFY */}
        {topTracks&&(!searchWord||searchWord==="")&&<Container fluid className="cardsTop" >
           <hr/>
           <div><h3>Top 10 Spotify Tracks'</h3></div>
           <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index<5 ? <Col><Track2 currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index>=5 ? <Col><Track2 currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
          </Container>}

        {/* CAROSELLO TOP 10 PLAYLIST SPOTIFY */}
        {topPlaylists&&(!searchWord||searchWord==="")&&<Container fluid className="cardsTop" >
            <hr/>
            <div><h3>Top 10 Spotify Playlist's</h3></div>
            <Carousel indicators={false} controls={false}>
              <Carousel.Item interval={5000}>
                  <Row>
                    {topPlaylists.map((currentPlaylist, index) => (                    
                        index<5 ? <Col><Playlist3 playlist={currentPlaylist} key={currentPlaylist.id}/></Col> : null
                      ))}
                  </Row>
                </Carousel.Item>
              <Carousel.Item interval={5000}>
                  <Row>
                    {topPlaylists.map((currentPlaylist, index) => (                    
                        index>=5 ? <Col><Playlist3 playlist={currentPlaylist} key={currentPlaylist.id}/></Col> : null
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
          {filterArr[0]&&searchResultTracks&&<div >
            <hr/>
            <h4>La ricerca delle Tracce ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultTracks.map(currentTrack => (                    
                  <Track currentTrack={currentTrack} key={currentTrack.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          {/* PLAYLISTS */}
          {filterArr[1]&&searchResultPlaylists&&<div >
            <h4>La ricerca delle Playlist ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultPlaylists.map(currentPlaylist => (                    
                  <Playlist2 playlist={currentPlaylist} key={currentPlaylist.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          {/* ALBUMS */}
          {filterArr[2]&&searchResultAlbums&&<div >
            <h4>La ricerca degli Album ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultAlbums.map(currentAlbum => (                    
                  <Album currentAlbum={currentAlbum} key={currentAlbum.id}/>
                ))}
              </div>
            <hr/>
          </div>}
        
        </Container>
        
        {/* FOOTER AGGIUNTA CANZONI A PLAYLIST */}
           {showFooter&&<FooterElement close={()=>setShowFooter(false)}></FooterElement>}
      </>
    )
}

export default NavigationPage





