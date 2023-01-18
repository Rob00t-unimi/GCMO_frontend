import axios from 'axios';
import { useEffect, useState } from 'react';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function useAuth(code) {

    const [ accessToken, setAccessToken ] = useState();
   

    useEffect(() => {
        if (!code) return window.history.pushState({}, null,'/')

        axios.post(`${SERVER_BASIC_URL}/login`, {
            code
        })
        .then( res => {
            console.log(res.data)
            setAccessToken(res.data.accessToken);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expiresIn' , res.data.expiresIn);
            //const expiresIn = res.data.expiresIn
            //localStorage.setItem('expiresAt', Date.mow()+expiresIn*1000);   //segna il tempo momento di quando scadrà il token in millisecondi
        })
        .catch((err) => {
            console.log(err)
        } )
    }, [accessToken, code])

    return accessToken
}