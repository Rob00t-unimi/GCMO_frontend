import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './style.css';
import NavigationBar from '../../components/navigationBar/navigationBar'
import ButtonLogin from '../../components/buttonLogin/buttonLogin'

function PersonalArea() {

    if ((localStorage.getItem("accessToken")==null)||(localStorage.getItem("accessToken")=="undefined")) {
      return(
        <>
        <NavigationBar/>
        <div className="notLoggedBanner container bg-dark opacity-75 d-flex flex-column ">
          <p className="text-light font-weight-bold text-center font-family-verdana text-lg">Attenzione! devi prima accedere a Spotify per visualizzare il contenuto di questa pagina.</p>
        <ButtonLogin text="Accedi con Spotify"/>
        </div>
        </>
      )
    }

    return(
        <>
       <NavigationBar/>
        </>
    )
}

export default PersonalArea;