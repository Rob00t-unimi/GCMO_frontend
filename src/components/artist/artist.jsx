import React from "react";
import {Card, Button} from 'react-bootstrap'
import './style.css'
import '../general.css'
import SpotifyWebApi from 'spotify-web-api-node';
import { useState } from 'react';
import { useEffect } from 'react';
import { Heart, HeartFill} from 'react-bootstrap-icons';
import ArtistViewModal from "../artistViewModal/artistViewModal";
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';







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
        .catch(err => {
            ErrorStatusCheck(err)
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
        .catch(err => {
            ErrorStatusCheck(err)
        })
    } else {
        //chiamata per seguire 
        spotifyApi.followArtists([artist.id])
        .then(res=>{
            setType(true)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }
}

const [show, setShow] = useState(false)


//___________________________________________________________________________________________________________________________

    return(
        <Card className='cardVertical bg-dark text-light' >
            <div className='btn btn-dark text-light text-start' onClick={() => { setShow(true) }}>
                <div className="cardImgRounded" style={{ backgroundImage: `url(${artist.image})` }}></div>
                    {/* <div className="numberTop"><h3>{artist.position}</h3></div> */}
                    <Card.Text>
                        <Card.Title className="text-center">{artist.name}</Card.Title>
                    </Card.Text>

                    <Card.Text className="text-center"><i>[{artist.genres[0]}]</i></Card.Text>
                <div className="followersArtistCard text-center">Followers: {artist.followers}</div>  
            </div>
                {type  ? 
                    <div className=' d-flex'>
                        <Button className='verticalCardBtn' onClick={switchFollow}><HeartFill/></Button> 
                    </div> :
                    <div className=' d-flex'>
                        <Button className='verticalCardBtn' onClick={switchFollow}><Heart/></Button>
                    </div>
                }

            {show&&<ArtistViewModal show={show} onClose={()=>{setShow(false)}} artist={artist}></ArtistViewModal>}
        </Card>
    )
}

export default Artist