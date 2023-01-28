import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.min.css' ;
import {Form, Col, Row } from "react-bootstrap";
import './style.css';
import SpotifyWebApi from "spotify-web-api-node";
import ErrorStatusCheck from "../../util/errorStatusCheck";




//INIZIALIZZO L'OGGETTO SPOTIFYAPI CON IL CLIENT ID_______________________________________________________________________________________
const CLIENT_ID ='61e53419c8a547eabe2729e093b43ae4' //'5ee1aac1104b4fd9b47757edf96aba44'  //'1e56ed8e387f449c805e681c3f8e43b4'  // '238334b666894f049d233d6c1bb3c3fc'
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID
});






export default function FiltriRicerca({changeLimit, filterArr, /*isAllowed, userSelection,*/ cosaCercare, /*comeCercare*/ setOptionCategory}){

    //CONTROLLO IL TOKEN e lo passo all'oggetto spotifyApi____________________________________________________________________________________

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    }, [accessToken])


    //___RICHIEDO LE CATEGORIE DI SPOTIFY (o generi) (sistema ORGANIZZATO TRAMITE TAG)_______________________________________________________________________________________________________________________________________________________________________________

    const [categorie, setCategorie] = useState()
    
    useEffect(() => {

        spotifyApi.getCategories()
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


    
  //_______________________________________________________________________________________________________________________________________________________________________________________________

  const [showCheckbox, setShowCheckbox] = useState(filterArr[0])

    function switchingValues(index) {
        const newFilterArr = [...filterArr];
        newFilterArr[index] = !newFilterArr[index];
        cosaCercare(newFilterArr);
        if(index===0) {
            setShowCheckbox(!showCheckbox)
        }  
    }



    function setCategoryPlaylist(idCategoria){
        setOptionCategory(idCategoria)
        if (idCategoria!=="") {
            const newFilterArr = [true, false, false, false];
            cosaCercare(newFilterArr);
        } else {
            const newFilterArr = [true, true, true, true];
            cosaCercare(newFilterArr);
        }
    }
    console.log(filterArr)
    return(
    <Col className="colonnaFiltri bg-dark text-light">
        <h4 className="text-center">Filtri di Ricerca:</h4>
        <hr />
        
        <Row><Col><h5 className="text-center">Playlist</h5></Col><Col><Form.Check  className="switchFilter" type="switch"  checked={filterArr[0] } onChange={()=>switchingValues(0)}></Form.Check></Col></Row>          

        {showCheckbox&&categorie&&<>
            <div className="CategorieTitle text-center"><h6>Puoi scegliere una categoria di ricerca per le playlist: </h6></div> 
            <select class="form-control selectCategory" onChange={(e) => setCategoryPlaylist(e.target.value)}>
                <option value="" selected className="text-center">Seleziona una categoria</option>
                {/* <option value="nomeTraccia" selected className="text-center">Nome di una traccia</option> */}
                {categorie.map((category) => (
                    <option key={category.id} value={category.id} className="text-center">{category.name}</option>
                ))}
            </select>
        </>}
        <hr />
        <Row><Col><h5 className="text-center">Canzoni</h5></Col><Col><Form.Check custom className="switchFilter" type="switch"  checked={filterArr[1] }  onChange={()=>switchingValues(1)}></Form.Check></Col></Row>                
        <hr />
        <Row><Col><h5 className="text-center">Album</h5></Col><Col> <Form.Check className="switchFilter" type="switch"  checked={filterArr[2] } onChange={()=>switchingValues(2)}></Form.Check></Col></Row>                   
        <hr />
        <Row><Col><h5 className="text-center">Artisti</h5></Col><Col><Form.Check  className="switchFilter" type="switch"  checked={filterArr[3] } onChange={()=>switchingValues(3)}></Form.Check></Col></Row>                 

        <hr />
        <div className="d-flex flex-row">
            <Col><h6 className="text-center">Numero di risultati:</h6></Col>
            <Col className="text-end"><input className="text-center inserimentoNumero" type="number" min={5} max={25} placeholder={5} onChange={(e)=>{changeLimit(e.target.value)}}></input></Col>
        </div>
        <hr />
    </Col>
    )
}