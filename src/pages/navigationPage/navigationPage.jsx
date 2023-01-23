import FooterElement from "../../components/footerElement/footerElement";
import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import { Form, Container} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import Playlist2 from "../../components/playlist-2/playlist-2"
import Track from "../../components/Track/track";
import refreshToken from "../../util/refreshToken";



//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
const CLIENT_ID = '238334b666894f049d233d6c1bb3c3fc' //'61e53419c8a547eabe2729e093b43ae4';
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
  if(showFooter==false) {
    localStorage.removeItem('createdPlaylist')
  }
}, [showFooter])

//GET TOP PLAYLIST_____________________________________________________________________________________________________________

  const [topTracks, setTopTracks] = useState()

  function getTop() {

  }

 //RICERCA______________________________________________________________________________________________________________________


  const [searchFilter, setSearchFilter] =useState('TITLE')
  const [searchWord, setSearchWord] = useState('')
  const [searchResultPlaylists, setSearchResultPlaylists] = useState()
  const [searchResultTracks, setSearchResultTracks] = useState()

  useEffect(() => {
    if (searchWord && searchWord!=='') {
      // switch (searchFilter) {
      //       case 'TITLE': 

              spotifyApi.search(searchWord, ['track', 'playlist'], { limit : 5})
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
                    public: item.public ? item.public : null,
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
                    genres: item.genres,
                    artists: item.artists.map(artist => artist.name)
                  }
                })                
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
    
  },[searchWord])


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
        <div className="search d-flex flex-row">
          <Form.Control className="searchForm" type="search mb-3" placeholder="Cerca Playlist o Traccia musicale" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
          <select name="visibility" value={searchFilter} onChange={(e)=> {setSearchFilter(e.target.value)}}>
              <option className="text-center" value={"TITLE"}> Titolo </option>
              <option className="text-center" value={"ARTIST"}> Artista </option>
              <option className="text-center" value={"TAG"}> Tag </option>
              <option className="text-center" value={"GENERE"}> Genere </option>
            </select>
        </div>
        <Container>
          {searchResultTracks&&<div >
            <div>La ricerca delle Tracce ha prodotto i seguenti risultati:</div>
              <div>
                {searchResultTracks.map(currentTrack => (                    
                  <Track currentTrack={currentTrack} key={currentTrack.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          {searchResultPlaylists&&<div >
            <div>La ricerca delle Playlist ha prodotto i seguenti risultati:</div>
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





