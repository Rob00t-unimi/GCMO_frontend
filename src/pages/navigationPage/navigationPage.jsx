import FooterElement from "../../components/footerElement/footerElement";
import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import { Form, Container, Row, Col} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import Playlist2 from "../../components/playlist-2/playlist-2"
import Playlist3 from "../../components/playlist-3/playlist-3"
import Track from "../../components/Track/track";
import Track2 from "../../components/track2/track2";
import refreshToken from "../../util/refreshToken";
import FiltriRicerca from "../../components/filtriRicerca/filtriRicerca";



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4' //238334b666894f049d233d6c1bb3c3fc
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


  const [searchFilter, setSearchFilter] =useState('TITLE')
  const [searchWord, setSearchWord] = useState('')
  const [searchResultPlaylists, setSearchResultPlaylists] = useState()
  const [searchResultTracks, setSearchResultTracks] = useState()

  useEffect(() => {
    if (searchWord && searchWord!=='') {
      // switch (searchFilter) {
      //       case 'TITLE': 

              spotifyApi.search(searchWord, ['track', 'playlist'], { limit : 10})
              .then(result => {
                console.log('result', result)
                const playlists = result.body.playlists.items.map(item => {   //ricevo e ciclo su una map di items
                  return {
                    image: item.images && item.images.length > 0 ? item.images[0].url : null,
                    name: item.name,
                    description: item.description ? item.description : null,
                    id: item.id,
                    ownerId: item.owner.id,
                    ownerName: item.owner.display_name,
                  }
                })
                setSearchResultPlaylists(playlists)
                const tracks = result.body.tracks.items.map(item => {
                  return {
                    image: item.album.images[0].url,
                    name: item.name,
                    album: item.album.name,
                    id: item.id,
                    releaseDate: item.album.release_date,
                    artists: item.artists.map(artist => artist.name),
                    uri: item.uri,
                  }
                })
                console.log("traccia", tracks)                
                setSearchResultTracks(tracks)
              })
              .catch(e => {
                if (e.response.status === 401 || e.response.status === 403) {
                    refreshToken()
                }
            })
              
            //   break;
                
            // case 'ARTIST':
              
            //   break;

            // case 'TAG':
              
            //   break;

            // case 'GENERE':
              
            //   break;
          
            // default:
            //   break;
          // }
    } else {
      setSearchResultPlaylists(null)
      setSearchResultTracks(null)
    }
    
  },[searchWord, showFooter])


  //GET TOP PLAYLIST_____________________________________________________________________________________________________________

  const [topPlaylists, setTopPlaylists] = useState()
  const [topTracks, setTopTracks] = useState()
    

  function getTop() {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    spotifyApi.getFeaturedPlaylists({ limit: 5, offset: 0, country: currentUser.country })
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
    .catch(e => {
      if (e.response.status === 401 || e.response.status === 403) {
          refreshToken()
      }
    })


  //per ottenere i brani più popolari non c'è una chiamata specifica, quindi chiedo i primi 5 brani della playlist top 50 italia oppure se l'utente non è italiano uso top 50 globale
  spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF', {limit: 5, offset: 0})
  .then(res => {
    const currentTopTracks = res.body.items.map((item, index) => {
      return {
        image: item.track.album.images[0].url,
        name: item.track.name,
        album: item.track.album.name,
        id: item.track.id,
        releaseDate: item.track.album.release_date,
        artists: item.track.artists.map(artist => artist.name),
        uri: item.track.uri,
        index: index+1
      }})
      setTopTracks(currentTopTracks)
      
    }) 
  .catch(e => {
    if (e.response.status === 401 || e.response.status === 403) {
        refreshToken()
    }
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
  spotifyApi.getMyTopTracks({limit: 5, offset: 0})
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
        uri: item.uri,
        index: index+1
      }})
      setMyTopTracks(myCurrentTopTracks)
      
    }) 
  .catch(e => {
    console.log("errore", e)
    if (e.response.status === 401 || e.response.status === 403) {
        refreshToken()
    }
  })
}


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
        <Container className="search d-flex flex-row">
          <Form.Control className="width-100" type="search mb-3" placeholder="Cerca Playlist o Traccia musicale" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
        </Container>

          <FiltriRicerca></FiltriRicerca>
        {myTopTracks&&(!searchWord||searchWord=="")&&<Container fluid className="cardsTop" >
          <hr/>
            <div><h3>My Top Tracks</h3></div>
            <Row>
              {myTopTracks.map(myCurrentTrack => (                    
                  <Col><Track2 currentTrack={myCurrentTrack} key={myCurrentTrack.id}/></Col>
                ))}
            </Row>
        </Container>}

        {topTracks&&topPlaylists&&(!searchWord||searchWord=="")&&<Container fluid className="cardsTop" >
          <hr/>
            <div><h3>Top 5 Spotify Playlist's</h3></div>
            <Row>
              {topPlaylists.map(currentPlaylist => (                    
                  <Col><Playlist3 playlist={currentPlaylist} key={currentPlaylist.id}/></Col>
                ))}
            </Row>
            <hr/>
            <div><h3>Top 5 Spotify Tracks'</h3></div>
            <Row>
              {topTracks.map(currentTrack => (                    
                  <Col><Track2 currentTrack={currentTrack} key={currentTrack.id}/></Col>
                ))}
            </Row>
        </Container>}
        
        <Container style={{marginBottom: localStorage.getItem('createdPlaylist') ? "25vh" : 0}}>
          {searchResultTracks&&<div >
            <hr/>
            <h4>La ricerca delle Tracce ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultTracks.map(currentTrack => (                    
                  <Track currentTrack={currentTrack} key={currentTrack.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          {searchResultPlaylists&&<div >
            <h4>La ricerca delle Playlist ha prodotto i seguenti risultati:</h4>
              <div>
                {searchResultPlaylists.map(currentPlaylist => (                    
                  <Playlist2 playlist={currentPlaylist} key={currentPlaylist.id}/>
                ))}
              </div>
            <hr/>
          </div>}
        </Container>
        
        
           {showFooter&&<FooterElement close={()=>setShowFooter(false)}></FooterElement>}
      </>
    )
}

export default NavigationPage





