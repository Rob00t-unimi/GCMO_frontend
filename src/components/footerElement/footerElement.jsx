import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import playlistImage from '../../assets/generalPlaylistImage.jpg'
import { spotifyApi } from '../../util/costanti';
import ErrorStatusCheck from '../../util/errorStatusCheck';



function FooterElement({close, playlist}){

    const [immagine, setImmagine] = useState()

    //CONTROLLO L'IMMAGINE_________________________________________________________________________________________________________________________________________________________________________________________________________________

    useEffect(() => {
        if(playlist.image!=="ASK"){    //se l'immagine ha il valore speciale "ASK" significa che non c'è ma dovrebbe esserci quindi chiedo l'immagine altrimenti inserisco quello che c'è (l'immagine o null)
            setImmagine(playlist.image)
        } else{
            recuperaImmagine()
        }
    }, [])

    //RECUPERO L'IMMAGINE CON CHIAMATE RICORSIVE____________________________________________________________________________________________________________________________________________________________________________________________

    function recuperaImmagine() {
        spotifyApi.getPlaylist(playlist.id)         //metto una ricorsione altrimenti arriva la risposta quando l'immagine non è ancora stata salvata nella playlist nei server delle api
            .then(dat=>{                                 //eseguo la ricorsione finchè non arriva l'immagine
                if((dat.body.images.length > 0)&&(!playlist.oldImage || dat.body.images[0].url!==playlist.oldImage)) {        //finchè non arriva l'immagine non la cambio
                    setImmagine(dat.body.images[0].url)                                                                     //se l'immagine arriva ed è la stessa di oldImage significa che non è ancora stata cambiata quindi continuo
                    return                                                                                                  //se c'è oldImage ed è diverso dall'immagine arrivata posso fermarmi
                } else {   
                    setTimeout(() => {
                        recuperaImmagine()
                    }, 250);                                                                                                 //se oldImage è null mi fermo non appena arriva un immagine poichè non è stata cambiata
                }
            })
            .catch(err=>{
                setTimeout(() => {
                    ErrorStatusCheck(err)               //uso i timeout per rallentare e quindi diminuire il numero di chiamate ricorsive
                    recuperaImmagine()
                }, 250);      
            })
    }

    //CHIUDE IL FOOTER e rimuove la playlist dal local storage______________________________________________________________________________________________________________________________________________________________________________

    function chiudi() {
        localStorage.removeItem('createdPlaylist')
        localStorage.removeItem('createdPlaylistTracks')
        close()
    }

//RENDER COMPONENTE_________________________________________________________________________________________________________________________________________________________________________________________________________________________
    
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
                            <Button className='footer-button btn-light' onClick={chiudi}>Chiudi</Button>
                        </Col>
                    </Row>
                </Card>
            </Container>
        )
    
}

export default FooterElement