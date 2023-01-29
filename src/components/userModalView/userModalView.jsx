import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Container, Table } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import'../general.css'
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import spotifyLogo from "../../assets/SpotifyLogo01.png"
import PlaylistCardNavigationPage from '../playlistCardNavigationPage/playlistCardNavigationPage'


//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
const CLIENT_ID = '5ee1aac1104b4fd9b47757edf96aba44'//'238334b666894f049d233d6c1bb3c3fc'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '61e53419c8a547eabe2729e093b43ae4'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});






export default function UserModalView({playlistOwnerId, show, onClose, showFooter, createdPlaylist}){

    //CONTROLLO IL TOKEN e lo passo all'oggetto spotifyApi____________________________________________________________________________________

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

//_____________________________________________________

const [user, setUser] = useState()
const [userPlaylists, setUserPlaylists] = useState()

    useEffect(() => {
        spotifyApi.getUser(playlistOwnerId)
        .then(res=>{
             const currentUser = {
                name: res.body.display_name,
                id: res.body.id,
                followers: res.body.followers.total,
                image: res.body.images && res.body.images.length > 0 ? res.body.images[0].url : null,
                uri: res.body.uri,
                followed: false
            }
            setUser(currentUser)

            spotifyApi.getUserPlaylists(currentUser.id)
            .then(result => {
                console.log("playlists", result)
                const playlists = result.body.items.map(item => {   //ricevo e ciclo su una map di items
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
                setUserPlaylists(playlists)
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }, [])

//_______________________________________________________________________

useEffect(() => {
    if(!user) return

    spotifyApi.isFollowingUsers([user.id])
    .then(result => {
        const newUser = {
            ...user,
            followed: result.body[0]
        }
        setUser(newUser)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}, [])



function follow() {
    spotifyApi.followUsers([user.id])
    .then(result => {
        console.log("followed?",result)
        const newUser = {
            ...user,
            followed: true
        }
        setUser(newUser)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}

function unfollow() {
    spotifyApi.followUsers([user.id])
    .then(result => {
        const newUser = {
            ...user,
            followed: false
        }
        setUser(newUser)
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}


return (
    <Modal className='bg-light bg-opacity-25' show={show} size="xl" centered>

    <Modal.Header className='bg-dark'>
        
        <Container className='d-flex' >
        {user&&<div className='immagineArtista' style={{ backgroundImage: `url(${user.image ? user.image : null})` }}></div>}
        {user&&<div className='text'>  
            <div className='text-light '><h1 >{user.name}</h1></div>
            <div className='text-light followersArtista '>{"Followers: "+user.followers}</div>
            {!user.followed&&<Button className='btn-success' onClick={follow} >Segui</Button>}
            {user.followed&&<Button onClick={unfollow} >Segui Già</Button>}
        </div>}
    </Container>
    </Modal.Header>
    <Modal.Body className='bg-dark'>
        <div>
            {user&&<h4 className='text-light text-center'>{user.name}'s Playlists</h4>}
            <hr className='text-light'></hr>
            
            <div style={{ maxHeight: "50vh", overflowY: "auto"}}>
                <Table >

                {userPlaylists ? 
                    userPlaylists.map((playlist, index) =>(
                    <PlaylistCardNavigationPage playlist={playlist} showFooter={showFooter} createdPlaylist={createdPlaylist}></PlaylistCardNavigationPage>
                )) : null
                }
            </Table> 
            </div>
        </div>
    </Modal.Body>
    <Modal.Footer className='bg-dark justify-content-center'>
        <Button className='btn-light' onClick={onClose}>Close</Button>
    </Modal.Footer>
</Modal>
)
    

}