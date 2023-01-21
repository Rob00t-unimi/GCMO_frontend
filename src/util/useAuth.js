import axios from 'axios';
import { useEffect, useState } from 'react';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function useAuth(code) {

    const [ accessToken, setAccessToken ] = useState();
   
    //eseguita ogni volta che accessToken o code Cambiano
    useEffect(() => {
        if (!code) return window.history.pushState({}, null,'/')    //se code è null rimando alla root

        axios.post(`${SERVER_BASIC_URL}/login`, {       //invio una richiesta al mio server con il code 
            code
        })
        .then( res => {
            console.log(res.data)
            setAccessToken(res.data.accessToken);                               //il server risponde con i token e li metto nel local storage
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expiresIn' , res.data.expiresIn);
            //const expiresIn = res.data.expiresIn
            //localStorage.setItem('expiresAt', Date.mow()+expiresIn*1000);   //segna il tempo momento di quando scadrà il token in millisecondi
        })
        .catch((err) => {
            console.log(err)            //se il serve risponde con un errore lo stampo in console
        } )
    }, [accessToken, code])

    return accessToken
}