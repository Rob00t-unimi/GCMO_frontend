import axios from 'axios';
import { useEffect, useState } from 'react';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function useAuth(code) {

    const [ accessToken, setAccessToken ] = useState();
   
    useEffect(() => {
        if (!code) return window.history.pushState({}, null,'/')    //se code è null rimando alla root

        console.log("Authentication...")

        axios.post(`${SERVER_BASIC_URL}/login`, {       //invio una richiesta al mio server con il code 
            code
        })
        .then( res => {
            console.log(res.data)
            setAccessToken(res.data.accessToken);                               //il server risponde con i token e li metto nel local storage
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expiresIn' , res.data.expiresIn);
        })
        .catch((err) => {
            console.log(err)
        } )
    }, [accessToken, code])

    return accessToken
}