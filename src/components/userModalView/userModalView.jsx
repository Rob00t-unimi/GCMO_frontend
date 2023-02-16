import React, { useEffect, useState } from 'react'
import { Button, Modal, Container, Table } from 'react-bootstrap'
import'../generalStyle.css'
import ErrorStatusCheck from '../../util/errorStatusCheck'
import PlaylistCardNavigationPage from '../playlistCardNavigationPage/playlistCardNavigationPage'
import { spotifyApi } from '../../util/costanti';



export default function UserModalView({playlistOwnerId, show, onClose, showFooter, createdPlaylist}){


    const [user, setUser] = useState()
    const [userPlaylists, setUserPlaylists] = useState()

    //RICHIEDERE INFO UTENTE E PLAYLISTS DELL'UTENTE________________________________________________________________________________

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

//VERIFICA SE L'UTENTE è SEGUITO_________________________________________________________________________________________________________

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
}, [user])

//SEGUE L'UTENTE__________________________________________________________________________________________________________________________

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

//SMETTE DI SEGUIRE L'UTENTE_______________________________________________________________________________________________________________

function unfollow() {
    spotifyApi.unfollowUsers([user.id])
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

//_________________________________________________________________________________________________________________________________________

return (
    <Modal className='bg-light bg-opacity-25' show={show} animation={true} size="xl" centered>

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