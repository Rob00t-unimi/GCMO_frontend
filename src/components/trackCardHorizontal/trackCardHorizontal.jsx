import React, { useEffect, useState, useContext } from 'react'
import {Card, Button, Col} from 'react-bootstrap'
import '../generalStyle.css'
import { HeartFill, Heart, Plus} from 'react-bootstrap-icons';
import TrackViewModal from "../trackViewModal/trackViewModal";
import ErrorStatusCheck from '../../util/errorStatusCheck'
import { spotifyApi } from '../../util/costanti';
import { ToastContext } from '../../App';



function TrackCardHorizontal({currentTrack, showFooter, currentPlaylist}){


    const {setToast} = useContext(ToastContext)

    const [type, setType] = useState();


//controllo che tipo di traccia è ________________________________________________________________________________________________

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
        <Card className='card d-flex flex-row bg-dark text-light' >
            <div className='btn btn-dark text-light text-start d-flex flex-row' onClick={() => { setShow(true) }}>
                    <Card.Img className='cardImg' src={currentTrack.image}/>
                    <div className='card-body d-flex'>
                        <Col>
                            <Card.Title>{currentTrack.name}</Card.Title>
                            <Card.Text>{currentTrack.artists.join(', ')}</Card.Text>
                        </Col>
                        <Col>
                            <Card.Text className="text-end">{currentTrack.duration}</Card.Text>
                        </Col>
                        <Col>
                            <div className="text-center" style={{marginLeft: "3rem"}} >Release date: {currentTrack.releaseDate}</div>
                        </Col>
                    </div>
            </div>
                <Col className="d-flex">
                    {!addBtn&&<Col>
                        <div className="buttonCardOrizzontale" style={{width: "44px"}}/>
                    </Col>}
                    <Col>
                        {type  ? 
                            <div className=' d-flex'>
                                <Button className='buttonCardOrizzontale btn-dark ' onClick={switchFollow}><HeartFill/></Button> 
                            </div> :
                            <div className=' d-flex'>
                                <Button className='buttonCardOrizzontale btn-dark' onClick={switchFollow}><Heart/></Button>
                            </div>
                        }
                    </Col>
                    {addBtn&&<Col>
                        <div className="d-flex"><Button className="buttonCardOrizzontale btn-success" onClick={addTrack}><Plus></Plus></Button></div>
                    </Col>}
                </Col>
                {show&&<TrackViewModal show={show} onClose={()=>setShow(false)} currentTrack={currentTrack}></TrackViewModal>}
        </Card>
        </>
    )
}

export default TrackCardHorizontal