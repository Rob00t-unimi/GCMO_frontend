import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import { spotifyApi } from '../../util/costanti';


function FooterElement({close, playlist}){

    const [immagine, setImmagine] = useState()

    useEffect(() => {
        if(playlist.image!=="ASK"){    //se l'immagine ha il valore speciale "ASK" significa che non c'è ma dovrebbe esserci quindi chiedo l'immagine altrimenti inserisco quello che c'è (l'immagine o null)
            setImmagine(playlist.image)
            return
        }
        recuperaImmagine()
    }, [])

    function recuperaImmagine() {
        spotifyApi.getPlaylist(playlist.id)         //metto una ricorsione altrimenti arriva la risposta quando l'immagine non è ancora stata salvata nella playlist nei server delle api
            .then(dat=>{                                 //eseguo la ricorsione finchè non arriva l'immagine
                console.log("datttt", dat)
                if(dat.body.images.length > 0) {
                    setImmagine(dat.body.images[0].url)
                    return
                } else {
                    return recuperaImmagine()
                }
        })
    }

//RENDER COMPONENTE________________________________________________________________________________________________________________________
    
        return (
            <Container fluid className='footer' >
                <Card className='bg-dark text-light footerCard' >
                    <Row>
                        <Col className='text-start d-flex flex-row'>
                            <Card.Img className='footerImg' src={immagine ? immagine : playlistImage}/>
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