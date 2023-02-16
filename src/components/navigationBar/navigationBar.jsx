import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonLogin from '../buttonLogin/buttonLogin';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Nav } from 'react-bootstrap';

import logo from '../../assets/logoGCMO.png';
import fotoProfiloGenerica from '../../assets/fotoProfiloGenerica_light.png';

import Logout from '../../util/logout'


function NavigationBar() {

    let immagineProfilo = fotoProfiloGenerica
    const usr = JSON.parse(localStorage.getItem('user'))

    if (usr){
        if (usr.image) {
            immagineProfilo = usr.image
        }
    }   


//SE SONO LOGGATO__________________________________________________________________________________________________________________________

    if (localStorage.getItem('accessToken')!==null && localStorage.getItem('accessToken')!==undefined){
        return(
        <Navbar className= 'bg-dark' fixed='top'>
            <Navbar.Brand>
                <Link to="/"><img src={logo} className="navLogo" alt='logo'/></Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Link to="/navigate" className="btn btn-dark btn-lg text-light">Naviga</Link>
                <Link to="/personalArea" className="btn btn-dark btn-lg text-light">Area Personale</Link>
        </Nav>
        <Button className='btn-dark btn-lg pulsanteLoginNav' onClick={Logout}>Esci</Button>
        
        <div className="navFotoProfilo d-flex justify-content-center"><img src={immagineProfilo} alt="immagine profilo" /></div>            
        </Navbar>
        )
    }

//SE NON SONO LOGGATO______________________________________________________________________________________________________________________

    return(
        <Navbar className='bg-dark'>
            <Navbar.Brand>
                <Link to="/"><img src={logo} className="navLogo" alt='logo'/></Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Link to="/navigate" className="btn btn-dark btn-lg text-light">Naviga</Link>
                <Link to="/personalArea" className="btn btn-dark btn-lg text-light">Area Personale</Link>
        </Nav>
        <div className='pulsanteLoginNav'><ButtonLogin text="Accedi" /></div>
        
        <div className="navFotoProfilo d-flex justify-content-center"><img src={fotoProfiloGenerica} alt="immagine profilo" /></div>            
        </Navbar>
    )


}

export default NavigationBar;