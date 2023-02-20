import axios from 'axios';
import { spotifyApi } from './costanti';

const SERVER_BASIC_URL = 'http://localhost:9000';

//uso un valore nel local storage come stato condiviso da ogni chiamata alla funzione di refresh
//per garantire che se una funzione di refresh è in esecuzione nessun'altro refresh venga eseguito contemporaneamente
//questo mi serve perchè molte chiamate falliscono se il token è scaduto e tutte insieme eseguirebbero il refresh
//causando un errore 429 che sfora i limiti di rating

export default function refreshToken(changeAccessToken) {

    if(localStorage.getItem("refreshingToken")) {
        return 
    } else {
        localStorage.setItem("refreshingToken", true) 
    }

    console.log("Refreshing token")
    
    const refreshToken = localStorage.getItem('refreshToken')       

     if (!refreshToken) {
        localStorage.removeItem("refreshingToken")
        return;
     }

    return axios.post(`${SERVER_BASIC_URL}/refresh`, {          //se c'è il refsresh token invio richiesta di refresh al mio server
                refreshToken
            })
            .then( res => {
                console.log("New AccessToken: ", res.data)
                localStorage.setItem('expiresIn', res.data.expiresIn)           //il server risponde con il nuovo accessToken e lo metto nel local storage
                localStorage.setItem('accessToken', res.data.accessToken)
                if (changeAccessToken){
                    changeAccessToken(res.data.accessToken)
                }
                console.log("Resetting AccessToken...")
                spotifyApi.setAccessToken(res.data.accessToken);
                console.log("AccessToken resetted:", localStorage.getItem('accessToken'))
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                localStorage.removeItem("refreshingToken")
              });
}

