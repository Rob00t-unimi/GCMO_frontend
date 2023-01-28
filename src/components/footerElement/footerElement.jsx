import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import playlistImage from '../../assets/generalPlaylistImage.jpg'


function FooterElement({close, playlist}){

  


//RENDER COMPONENTE________________________________________________________________________________________________________________________
    
        return (
            <Container fluid className='footer' >
                <Card className='bg-dark text-light footerCard' >
                    <Row>
                        <Col className='text-start d-flex flex-row'>
                            <Card.Img className='footerImg' src={playlist.image ? playlist.image : playlistImage}/>
                            <Card.Body className='footer-body'>
                               <h1>{playlist.name}</h1>
                               <h5>{playlist.ownerName}</h5>
                            </Card.Body>
                        </Col>
                        <Col className='text-end'>
                            <Card.Body className='footer-text'><h2 >Aggiungi delle Tracce alla playlist</h2></Card.Body>
                            <Button className='footer-button btn-light' onClick={close}>Chiudi</Button>
                        </Col>
                    </Row>
                </Card>
            </Container>
        )
    
}

export default FooterElement