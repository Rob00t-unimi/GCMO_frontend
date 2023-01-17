import React from "react";
import './style.css';

import ButtonLogin from '../../components/buttonLogin/buttonLogin';

import fullLogo from '../../assets/logoGCMO_fullSize.png'

import NavigationBar from '../../components/navigationBar/navigationBar'


function IndexPage(){

    

    return (
        <>
        <NavigationBar/>
        <div className="container d-flex flex-column justify-content-center"><img src={fullLogo}></img>
        <ButtonLogin text="Accedi con Spotify"/>
        </div>
        </>
    )
}

export default IndexPage;