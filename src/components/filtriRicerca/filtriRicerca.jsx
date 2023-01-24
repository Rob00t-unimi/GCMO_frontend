import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Container, Form, Col, Row } from "react-bootstrap";
import './style.css';

export default function FiltriRicerca({changeLimit, filterArr, /*isAllowed, userSelection,*/ cosaCercare, /*comeCercare*/}){

    function switchingValues(num) {
        let copy = /*userSelection*/ filterArr
        copy[num] = !copy[num] 
        cosaCercare(copy)
    }


    return(
    <Col className="colonna">
        <h3>Filtri di Ricerca:</h3>
        <hr />
        <Row><Col><h4>Canzoni</h4></Col><Col><Form.Check  className="switchFilter" type="switch" defaultChecked={filterArr[0] }  onChange={()=>switchingValues(0)}></Form.Check></Col></Row>                {/*disabled={!isAllowed[0]}*/}
        <hr />
        <Row><Col><h4>Playlist</h4></Col><Col><Form.Check  className="switchFilter" type="switch" defaultChecked={filterArr[1] } onChange={()=>switchingValues(1)}></Form.Check></Col></Row>                {/*disabled={!isAllowed[1]}*/}
        <hr />
        <Row><Col><h4>Album</h4></Col><Col> <Form.Check className="switchFilter" type="switch" defaultChecked={filterArr[2] } onChange={()=>switchingValues(2)}></Form.Check></Col></Row>                   {/*disabled={!isAllowed[2]}*/} 
        <hr />
        <Row><Col><h4>Artisti</h4></Col><Col><Form.Check  className="switchFilter" type="switch" defaultChecked={filterArr[3] } onChange={()=>switchingValues(3)}></Form.Check></Col></Row>                 {/*disabled={!isAllowed[3]}*/}
        {/*<hr />
         <Container className="d-flex flex-row">
        <h4 className="cercaPer">Cerca per:</h4>
        <select name="Cerca per:" onChange={(e) => comeCercare(e.target.value)}>
              <option className="text-center" value={"TITLE"}> Nome </option>
              <option className="text-center" value={"GENERE"}> Genere </option>
              <option className="text-center" value={"ARTIST"}> Artista </option>
              <option className="text-center" value={"TAG"} > #Tag </option>
        </select>
        </Container> */}
        <hr />
        <h6 className="text-center" >Numero di risultati:</h6>
        <Row><input className="text-center" type="number" min={5} max={25} placeholder={5} onChange={(e)=>{changeLimit(e.target.value)}}></input></Row>
    </Col>
    )
}