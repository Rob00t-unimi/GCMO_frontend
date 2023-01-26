import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import {Form, Col, Row } from "react-bootstrap";
import './style.css';

export default function FiltriRicerca({changeLimit, filterArr, /*isAllowed, userSelection,*/ cosaCercare, /*comeCercare*/}){

    function switchingValues(num) {
        let copy = filterArr
        copy[num] = !copy[num] 
        cosaCercare(copy)
    }


    return(
    <Col className="colonnaFiltri">
        <h4>Filtri di Ricerca:</h4>
        <hr />
        <Row><Col><h5>Canzoni</h5></Col><Col><Form.Check custom className="switchFilter" type="switch" defaultChecked={filterArr[0] }  onChange={()=>switchingValues(0)}></Form.Check></Col></Row>                
        <hr />
        <Row><Col><h5>Playlist</h5></Col><Col><Form.Check  className="switchFilter" type="switch" defaultChecked={filterArr[1] } onChange={()=>switchingValues(1)}></Form.Check></Col></Row>                
        <hr />
        <Row><Col><h5>Album</h5></Col><Col> <Form.Check className="switchFilter" type="switch" defaultChecked={filterArr[2] } onChange={()=>switchingValues(2)}></Form.Check></Col></Row>                   
        <hr />
        <Row><Col><h5>Artisti</h5></Col><Col><Form.Check  className="switchFilter" type="switch" defaultChecked={filterArr[3] } onChange={()=>switchingValues(3)}></Form.Check></Col></Row>                 

        <hr />
        <div className="d-flex flex-row">
            <Col><h6 >Numero di risultati:</h6></Col>
            <Col className="text-end"><input className="text-center inserimentoNumero" type="number" min={5} max={25} placeholder={5} onChange={(e)=>{changeLimit(e.target.value)}}></input></Col>
        </div>
    </Col>
    )
}