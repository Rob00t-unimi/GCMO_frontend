import React from "react";
import {Card} from 'react-bootstrap'
import './style.css'

function Track(track){

    return(
        <Card className='card d-flex flex-row bg-dark text-light' >
                    <Card.Img className='cardImg' src={track.image}/>
                    <Card.Body>
                        <Card.Title>{track.name}</Card.Title>
                        <Card.Text>{track.artists}</Card.Text>
                    </Card.Body>
                <Card.Text></Card.Text>
        </Card>
    )
}

export default Track