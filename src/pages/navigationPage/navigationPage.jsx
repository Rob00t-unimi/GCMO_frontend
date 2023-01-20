import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'
import { Form, Container} from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import Playlist from "../../components/Playlist/playlist"
import Track from "../../components/Track/track";
//import Footer from "../../components/footer/footer";

const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});


function NavigationPage(){

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  
  //   const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem("createdPlaylist")));
  //   const [showFooter, setShowFooter] = useState(false)

  // useEffect(() => {
  //   if(playlist) {
  //     setShowFooter(true)
  //   }
  // }, [])
  

  const [topTracks, setTopTracks] = useState()

  function getTop() {

  }


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
                //console.log(result)
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
                const tracks = result.body.tracks.items.map(item => {   //ricevo e ciclo su una map di items
                  return {
                    image: item.album.images[0].url,
                    name: item.name,
                    album: item.album.name,
                    artists: item.artists,
                    id: item.id,
                    releaseDate: item.album.release_date,
                  }
                })
                setSearchResultTracks(tracks)
                console.log(searchResultPlaylists)
                console.log(searchResultTracks)
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



    if (!(localStorage.getItem("accessToken"))||(localStorage.getItem("accessToken")==="undefined")) {
      return(
        <>
        <NavigationBar/>
        <div className="notLoggedBanner container bg-dark opacity-75 d-flex flex-column ">
          <p className="text-light font-weight-bold text-center font-family-verdana text-lg">Attenzione! devi prima accedere a Spotify per visualizzare il contenuto di questa pagina.</p>
          <ButtonLogin text="Accedi con Spotify"/>
        </div>
        </>
      )
    }

    return(
      <>
      <NavigationBar></NavigationBar>
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
                {searchResultTracks.map(track => (                    
                  <Track track={track}/>
                ))}
              </div>
            <hr/>
          </div>}
          {searchResultPlaylists&&<div >
            <div>La ricerca delle Playlist ha prodotto i seguenti risultati:</div>
              <div>
                {searchResultPlaylists.map(playlist => (                    
                  <Playlist playlist={playlist}/>
                ))}
              </div>
            <hr/>
          </div>}
        </Container>
        
          {/*showFooter&&<Footer playlist={playlist} show={showFooter} onClose={()=>{setShowFooter(false)}}></Footer>*/}
      </>
    )
}

export default NavigationPage





