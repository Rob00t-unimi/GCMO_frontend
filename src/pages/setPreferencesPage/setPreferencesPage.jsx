import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Form, Container, Row, Col, Button, Carousel} from "react-bootstrap";

import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';

import TrackCardHorizontal from "../../components/trackCardHorizontal/trackCardHorizontal";
import TrackCardVertical from "../../components/trackCardVertical/trackCardVertical";
import Album from "../../components/album/album";
import Artist from "../../components/artist/artist";
import "../../components/generalStyle.css"



export default function SetPreferencesPage(){

const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"))

  //Set di spotifyApi con l'accessToken corrente    
useEffect(() => {
  if (localStorage.getItem('accessToken')) {

    console.log("AccessToken setting...")
    spotifyApi.setAccessToken(localStorage.getItem('accessToken'));
    console.log("AccessToken setted:", localStorage.getItem('accessToken'))
    
  }
}, [accessToken])


const [searchWord, setSearchWord] = useState("")
const [tracks, setTracks]= useState([])
const [artists, setArtists]= useState([])
const [albums, setAlbums]= useState([])
const [topTracks, setTopTracks] = useState() 


useEffect(() => {
    if(searchWord&&searchWord!==""){
        ricerca()
    } else {
        setAlbums([])
        setTracks([])
        setArtists([])
        getTopTracks()
    }
}, [searchWord, accessToken])

//FUNZIONE DI RICERCA _________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  function ricerca(){
    spotifyApi.search(searchWord, ["track", "artist", "album"], {limit: 10})
    .then(res=>{
        console.log(res)
        setAlbums(res.body.albums.items.map(item=>{
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
        }))

        setTracks(res.body.tracks.items.map(item=>{
            const duration = new Date(item.duration_ms).toISOString().slice(14, 19);     //prendo la durata in ms della traccia, creo l'oggetto data, converto in stringa, prendo solo dal carattere 14 a 19 ovvero ore, minuti, secondi
            return {
            image: item.album.images[0].url,
            name: item.name,
            album: item.album.name,
            duration: duration,
            id: item.id,
            releaseDate: item.album.release_date,                                 //ricerca canzoni 
            artists: item.artists.map(artist => artist.name),
            artistsId: item.artists.map(artista => artista.id),
            uri: item.uri,
            }
        }))
        

        setArtists(res.body.artists.items.map(item=>{
            return {
                image: item.images && item.images.length > 0 ? item.images[0].url : null,
                name: item.name,
                id: item.id,
                followers: item.followers.total,
                uri: item.uri,    
                genres: item.genres,
      
              }
        }))

    })
    .catch(err=>{
        ErrorStatusCheck(err)
    })
  }

//GET TOP TRACKS______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  function getTopTracks() {
    spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF', {limit: 28, offset: 0})
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

  function avanti(){
    localStorage.setItem("visited", "true")
    window.location = '/personalArea'
  }

//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

  return(
    <>
    <Container fluid className="bg-dark text-light setPreferencesContainer">
        <h2 className="text-center setPreferencesTitle">
            Fai una ricerca e salva le tue preferenze musicali!
        </h2>
        <hr/>

              {/* FORM DI RICERCA */}
        <div className="d-flex flex-row justify-content-center">
          <Form.Control className="setPreferencesSearch" type="search mb-3" placeholder="Cerca una Traccia musicale, un Album o un Artista" value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}}/>
        </div>

        {/* CAROSELLO TOP 10 TRACKS SPOTIFY */}
        {topTracks&&(!searchWord||searchWord==="")&&<Container fluid className="containerRisultati" >
           <hr/>
           <Carousel className="width-100" indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index<7 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index>=7&&index<14 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
           <hr/>
           <Carousel className="width-100" indicators={false} controls={false}>
              <Carousel.Item interval={6000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index<21&&index>=14 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <Row>
                  {topTracks.map((currentTrack, index) => (                    
                      index>=21 ? <Col><TrackCardVertical currentTrack={currentTrack} key={currentTrack.id}/></Col> : null
                    ))}
                </Row>
              </Carousel.Item>
            </Carousel>
          </Container>}


        {(searchWord&&searchWord!=="")&&albums.length===0&&tracks.length===0&&artists===0&&<div className="text-center">Nessun Risultato</div>}

        {/* RISULTATI DI RICERCA */}
        <Container fluid className="containerRisultati">
          {/* ARTISTS */}
          {artists.length>0 && 
            <div>
                <hr />
                <h4 className="text-center">La ricerca degli Artisti ha prodotto i seguenti risultati:</h4>
                <hr />
                <Row>
                    {artists.map((artist, index) => (         
                        index<7&&<Col key={artist.id}><Artist artist={artist}/></Col>
                    ))}
                </Row>
            </div>
        }
          {/* TRACKS */}
          {tracks.length>0&&<div >
            <hr/>
            <h4 className="text-center">La ricerca delle Tracce ha prodotto i seguenti risultati:</h4>
            <hr />
              <div>
                {tracks.map(track => (                    
                  <TrackCardHorizontal currentTrack={track} key={track.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          {/* ALBUMS */}
          {albums.length>0&&<div >
            <h4 className="text-center">La ricerca degli Album ha prodotto i seguenti risultati:</h4>
            <hr />
              <div>
                {albums.map(currentAlbum => (                    
                  <Album currentAlbum={currentAlbum} key={currentAlbum.id}/>
                ))}
              </div>
            <hr/>
          </div>}
          
        </Container>

        <div className="text-center setPreferencesButton"><Button className="btn-success" onClick={avanti}>Avanti</Button></div>
    </Container></>
  )


}

