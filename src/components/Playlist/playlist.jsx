import SpotifyWebApi from 'spotify-web-api-node';
import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { BookmarkStarFill, Lock, Unlock } from 'react-bootstrap-icons';
import './style.css'



const CLIENT_ID = '61e53419c8a547eabe2729e093b43ae4';
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});


function Playlist({playlist}){

    const userInfo = JSON.parse(localStorage.getItem('user'));  
    const accessToken = localStorage.getItem('accessToken');

    const [type, setType] = useState();
    const [modalShow, setModalShow] = useState(false);  //ci sarà una modale per aprire le informazioni relative ad una playlist

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    //controllo che tipo di playlist è 
    useEffect(() => {
        console.log(playlist)
        if (playlist.ownerId !== userInfo.id) {     
            setType('FOLLOWED')
            return;
        }
        if (playlist.public) {
            
            setType('PUBLIC')
            return;
        }

        setType('PRIVATE')
    }, [])

    return(

        <Card className='card d-flex flex-row bg-dark text-light'>
            <Card.Img className='cardImg' src={playlist.image}/>
            <Card.Body>
                <Card.Title>{playlist.name}</Card.Title>
                <Card.Text>{playlist.ownerName}</Card.Text>
            </Card.Body>
        
            <Card.Text>
                { 
                type === 'FOLLOWED' ? <Button className='followed' ><BookmarkStarFill/></Button> :
                type === 'PUBLIC' ? <Button className='public btn-success'><Unlock/></Button> :
                <Button className='private btn-danger'><Lock/></Button>
                }
            </Card.Text>
        </Card>
    )
}

export default Playlist