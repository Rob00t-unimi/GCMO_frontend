import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import { Container, Form, Col, Row } from "react-bootstrap";
import './style.css';

export default function FiltriRicerca(){

    return(
    <Col className="colonna">
        <h3>Filtri di Ricerca:</h3>
        <hr />
        <Row><Col><h4>Canzoni</h4></Col><Col><Form.Check className="switchFilter" type="switch"></Form.Check></Col></Row>
        <hr />
        <Row><Col><h4>Playlist</h4></Col><Col><Form.Check className="switchFilter" type="switch"></Form.Check></Col></Row>
        <hr />
        <Row><Col><h4>Album</h4></Col><Col> <Form.Check className="switchFilter" type="switch"></Form.Check></Col></Row>
        <hr />
        <Row><Col><h4>Artisti</h4></Col><Col><Form.Check className="switchFilter" type="switch"></Form.Check></Col></Row>
        <hr />
        <Container className="d-flex flex-row">
        <h4 className="cercaPer">Cerca per:</h4>
        <select name="Cerca per:">
              <option className="text-center" value={"TITLE"}> Nome </option>
              <option className="text-center" value={"GENERE"}> Genere </option>
              <option className="text-center" value={"ARTIST"}> Artista </option>
              <option className="text-center" value={"TAG"}> #Tag </option>
        </select>
        </Container>
    </Col>
    )
}