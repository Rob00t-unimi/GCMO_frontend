import React from "react";
import './style.css';

import fullLogo from '../../assets/logoGCMO_fullSize.png'
import ButtonLogin from '../../components/buttonLogin/buttonLogin';
import NavigationBar from '../../components/navigationBar/navigationBar'


function IndexPage(){

    return (
        <>
        <div className="background">
            <NavigationBar/>
            <div className="container d-flex flex-column justify-content-center"><img src={fullLogo}></img>
            <ButtonLogin text="Accedi con Spotify"/>
            </div>
        </div>
        </>
    )
}

export default IndexPage;