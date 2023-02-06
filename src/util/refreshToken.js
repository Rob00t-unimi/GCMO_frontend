import axios from 'axios';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function refreshToken() {

    console.log("Refreshing token")
    
    const refreshToken = localStorage.getItem('refreshToken')       

     if (!refreshToken) {
        // window.location='/';        //se non c'è il refresh token non sono loggato, mando alla root
        return;
     }
    return axios.post(`${SERVER_BASIC_URL}/refresh`, {          //se c'è invio richiesta al mio server
                refreshToken
            })
            .then( res => {
                console.log(res.data)
                localStorage.setItem('expiresIn', res.data.expiresIn)           //risponde con il nuovo accessToken e lo metto nel local storage
                localStorage.setItem('accessToken', res.data.accessToken)
            })
            .catch((err) => {
                console.log(err)
            })

}

