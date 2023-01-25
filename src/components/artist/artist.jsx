import React from "react";
import {Card, Button} from 'react-bootstrap'
import './style.css'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import refreshToken from '../../util/refreshToken'
import { Heart, HeartFill, Plus, ArrowLeftShort} from 'react-bootstrap-icons';
import ArtistViewModal from "../artistViewModal/artistViewModal";


//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID___________________________________

const CLIENT_ID ='1e56ed8e387f449c805e681c3f8e43b4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'61e53419c8a547eabe2729e093b43ae4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID
});








function Artist({artist}){

    
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    const [type, setType] = useState();


//controllo che tipo di artista è (tra i preferiti o no)____________________________________________________
    useEffect(() => {

        spotifyApi.isFollowingArtists([artist.id])
        .then(res =>{
            console.log('risposta', res)
            setType(res.body[0])
            })
        .catch((e)=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    }, [artist])


//INVERTE IL TIPO DELL'artista________________________________________________________________________________

function switchFollow(){
    if (type) {
        //chiamata per smettere di seguire     
        spotifyApi.unfollowArtists([artist.id])
        .then(res=>{
            setType(false)
        })
        .catch(e=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    } else {
        //chiamata per seguire 
        spotifyApi.followArtists([artist.id])
        .then(res=>{
            setType(true)
        })
        .catch(e=>{
            if (e.response.status === 401 || e.response.status === 403) {
                refreshToken()
            }
        })
    }
}

const [show, setShow] = useState(false)


//___________________________________________________________________________________________________________________________

    return(
        <Card className='cardArtist bg-dark text-light' >
            <div className='btn btn-dark text-light text-start' onClick={() => { setShow(true) }}>
                <div className="cardImmagine " style={{ backgroundImage: `url(${artist.image})` }}></div>
                    {/* <div className="numberTop"><h3>{artist.position}</h3></div> */}
                    <Card.Text>
                        <Card.Title className="text-center">{artist.name}</Card.Title>
                    </Card.Text>

                <Card.Text className="text-center"><i>[{artist.genres[0]}]</i></Card.Text>
                <div className="followersCard text-center">Followers: {artist.followers}</div>  
            </div>
                {type  ? 
                    <div className=' d-flex actionDiv'>
                        <Button className='action ' onClick={switchFollow}><HeartFill/></Button> 
                    </div> :
                    <div className=' d-flex actionDiv'>
                        <Button className='action' onClick={switchFollow}><Heart/></Button>
                    </div>
                }

        {show&&<ArtistViewModal show={show} onClose={()=>{setShow(false)}} artist={artist}></ArtistViewModal>}
        </Card>
    )
}

export default Artist