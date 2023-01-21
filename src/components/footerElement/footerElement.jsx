import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import playlistImage from '../../assets/generalPlaylistImage.jpg'


function FooterElement(playlist){

//INIZIALIZZO L'IMMAGINE di copertina_____________________________________________________________________________________________________

    const [image, setImage] = useState(playlistImage);

    useEffect(() => {
        if (playlist.image) {
            setImage(playlist.image)
        }
        }, [])

//FUNZIONE DI CHIUSURA DEL FOOTER_________________________________________________________________________________________________________

    function close(){
        localStorage.removeItem('createdPlaylist')          //il footer compare solo se nel local storage c'è createdPlaylist (ho preferito scrivere questo controllo nel padre)
        //setPlaylist()
    }

//RENDER COMPONENTE________________________________________________________________________________________________________________________
    
        return (
            <>
           
                <Card className='card bg-dark text-light' >
                    <Row>
                        <Col className='text-start'>
                            <Card.Img className='cardImg' src={image}/>
                            <Card.Body className='cardbody'>
                                <h1>{playlist.name}</h1>
                                <h5>{playlist.ownerName}</h5>
                            </Card.Body>
                        </Col>
                        <Col className='text-center'>
                            <h1 className='text'>Aggiungi delle Tracce alla playlist selezionata</h1>
                        </Col>
                        <Col className='text-end'>
                            <Button className='action btn-light' onClick={close}>Chiudi</Button>
                        </Col>
                    </Row>
                </Card>

        
            </>
        )
    
}

export default FooterElement