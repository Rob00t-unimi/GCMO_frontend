import React, { useEffect, useState, useContext } from 'react'
import {Card, Button} from 'react-bootstrap'
import '../generalStyle.css'
import { Heart, HeartFill, Plus} from 'react-bootstrap-icons';
import TrackViewModal from "../trackViewModal/trackViewModal";
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



function TrackCardVertical({currentTrack, showFooter, currentPlaylist}){

    
    const {setToast} = useContext(ToastContext)

    const [type, setType] = useState();



//controllo che tipo di traccia è _____________________________________________________________________________________________
    useEffect(() => {

        spotifyApi.containsMySavedTracks([currentTrack.id])
        .then(res =>{
            //console.log('risposta', res)
            setType(res.body[0])
            })
            .catch(err => {
                ErrorStatusCheck(err)
            })
    }, [currentTrack])


//INVERTE IL TIPO DELLA TRACCIA__________________________________________________________________________________________________

function switchFollow(){
    if (type) {
        //chiamata per smettere di seguire     
        spotifyApi.removeFromMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(false)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    } else {
        //chiamata per seguire 
        spotifyApi.addToMySavedTracks([currentTrack.id])
        .then(res=>{
            setType(true)
        })
        .catch(err => {
            ErrorStatusCheck(err)
        })
    }
}


//AGGIUNGERE TRACCIA A PLAYLIST SELEZIONATA_________________________________________________________________________________
//se la createdPlaylist non è nel local storage showFooter sarà false e non renderizzo il Btn
//se showFooter è true ma la traccia è già presente nella playlist non renderizzo il Btn 
const [addBtn, setAddBtn] = useState()

useEffect(() => {

    let traccePlaylist = JSON.parse(localStorage.getItem('createdPlaylistTracks'))
    let trackIsJustContained = false

    if(!traccePlaylist||traccePlaylist.length===0) {
        setAddBtn(showFooter)
        return
    }

    
    for(let i=0; i<traccePlaylist.length; i++) {
        if (traccePlaylist[i]===currentTrack.id) {
            trackIsJustContained = true
        }
    }

    if (trackIsJustContained) {
        setAddBtn(false)
    } else {
        setAddBtn(showFooter)
    }

}, [showFooter] )


function addTrack(){

    spotifyApi.addTracksToPlaylist(currentPlaylist.id, [currentTrack.uri])
    .then(res=>{
        console.log("added",res)
        setAddBtn(false)
        let traccePlaylist = JSON.parse(localStorage.getItem('createdPlaylistTracks'))
        traccePlaylist = traccePlaylist.concat([currentTrack.id])
        localStorage.setItem('createdPlaylistTracks', JSON.stringify(traccePlaylist))
        setToast(true, "Traccia aggiunta correttamente")
    })
    .catch(err => {
        ErrorStatusCheck(err)
    })
}

const [show, setShow] = useState(false)

//___________________________________________________________________________________________________________________________

    return(
        <>
        <Card className='cardVertical bg-dark text-light' >
            <div className='btn btn-dark text-light text-start' onClick={() => { setShow(true) }}>
                    <Card.Img src={currentTrack.image}/>
                    <div className="card-img-overlay "><div className='numberTop text-center'><h3>{currentTrack.index}</h3></div></div>
                    <Card.Body>
                        <Card.Title>{currentTrack.name}</Card.Title>
                        <Card.Text>{currentTrack.artists.join(', ')}</Card.Text>
                        {/* <Card.Text>{currentTrack.genres.join(', ')}</Card.Text> */}
                    </Card.Body>
            </div>
            <div className="d-flex align-items-end" style={{height: "100%"}}>
                {addBtn&&<div className="d-flex"><Button className="verticalCardBtn btn-success" onClick={addTrack}><Plus></Plus></Button></div>}
                {type  ? 
                    <div className=' d-flex'>
                        <Button className='verticalCardBtn ' onClick={switchFollow}><HeartFill/></Button> 
                    </div> :
                    <div className=' d-flex'>
                        <Button className='verticalCardBtn' onClick={switchFollow}><Heart/></Button>
                    </div>
                }
            </div>
                {show&&<TrackViewModal show={show} onClose={()=>setShow(false)} currentTrack={currentTrack}></TrackViewModal>}
        </Card>
        </>
    )
}

export default TrackCardVertical