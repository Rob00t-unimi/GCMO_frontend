import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import {Form, Col, Row } from "react-bootstrap";
import './style.css';
import ErrorStatusCheck from "../../util/errorStatusCheck";
import { spotifyApi } from '../../util/costanti';







export default function FiltriRicerca({changeLimit, filterArr, /*isAllowed, userSelection,*/ cosaCercare, /*comeCercare*/ setOptionCategory, activeCategory}){



    //RICHIEDO LE CATEGORIE DI SPOTIFY (o generi) (sistema ORGANIZZATO TRAMITE TAG)_______________________________________________________________________________________________________________________________________________________________________________

    const [categorie, setCategorie] = useState()
    
    useEffect(() => {

        spotifyApi.getCategories({limit: 50})
        .then(res =>{
            const categories = res.body.categories.items.map(item=>{            // è possibile usare le categorie per richiedere un elenco di playlist di quella categoria
                return {                                                        // oppure per cercare canzoni tramite parola chiave e genere
                    id: item.id,                                                // oppure per cercare artisti tramite parola chiave e genere
                    name: item.name,
                    icon: item.icons[0].url,
                    href: item.href
                }
            })

            console.log("Categorie: ", categories)
            setCategorie(categories)
        })
        .catch(err => {
        ErrorStatusCheck(err)
        })

    }, [])


    
  //CAMBIO LO STATO DI UN FILTRO (attivo/disattivo)_____________________________________________________________________________________________________________________________________________________________________________________________________________________

    const [showCheckbox, setShowCheckbox] = useState(filterArr[0])

    function switchingValues(index) {
        const newFilterArr = [...filterArr];
        newFilterArr[index] = !newFilterArr[index];
        cosaCercare(newFilterArr);
        if(index===0) {
            setShowCheckbox(!showCheckbox)
        }  
    }

  //ABILITO/DISABILITO I FILTRI != da playlist ___________________________________________________________________________________________________________________________________________________________________________________________________________________________

    const [disabled, setDisabled] = useState([false, false, false, false])

    function setCategoryPlaylist(idCategoria){
        setOptionCategory(idCategoria)
        if (idCategoria!=="") {
            const newFilterArr = [true, false, false, false];
            cosaCercare(newFilterArr);
            setDisabled([true, true, true, true])
        } else {
            const newFilterArr = [true, true, true, true];
            cosaCercare(newFilterArr);
            setDisabled([false, false, false, false])
        }
    }


    //___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________


    return(
    <Col className="colonnaFiltri bg-dark text-light">
        <h4 className="text-center">Filtri di Ricerca:</h4>
        <hr />
        
        <Row><Col><h5 className="text-center">Playlist</h5></Col><Col><Form.Check  className="switchFilter" type="switch" disabled={disabled[0]}  checked={filterArr[0] } onChange={()=>switchingValues(0)}></Form.Check></Col></Row>          

        {showCheckbox&&categorie&&<>
            <div className="CategorieTitle text-center"><h6>Puoi scegliere una categoria di ricerca per le playlist: </h6></div> 
            <select class="form-control selectCategory" value={activeCategory ? activeCategory : ""} onChange={(e) => setCategoryPlaylist(e.target.value)}>
                <option value="" selected className="text-center">Seleziona una categoria</option>
                {/* <option value="nomeTraccia" selected className="text-center">Nome di una traccia</option> */}
                {categorie.map((category) => (
                    <option key={category.id} value={category.id} className="text-center">{category.name}</option>
                ))}
            </select>
        </>}
        <hr />
        <Row><Col><h5 className="text-center">Canzoni</h5></Col><Col><Form.Check custom className="switchFilter" type="switch" disabled={disabled[1]} checked={filterArr[1] }  onChange={()=>switchingValues(1)}></Form.Check></Col></Row>                
        <hr />
        <Row><Col><h5 className="text-center">Album</h5></Col><Col> <Form.Check className="switchFilter" type="switch" disabled={disabled[2]} checked={filterArr[2] } onChange={()=>switchingValues(2)}></Form.Check></Col></Row>                   
        <hr />
        <Row><Col><h5 className="text-center">Artisti</h5></Col><Col><Form.Check  className="switchFilter" type="switch" disabled={disabled[3]} checked={filterArr[3] } onChange={()=>switchingValues(3)}></Form.Check></Col></Row>                 

        <hr />
        <div className="d-flex flex-row">
            <Col><h6 className="text-center">Numero di risultati:</h6></Col>
            <Col className="text-end"><input className="text-center inserimentoNumero" type="number" min={5} max={50} placeholder={5} onChange={(e)=>{changeLimit(e.target.value)}}></input></Col>
        </div>
        <hr />
    </Col>
    )
}