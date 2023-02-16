import axios from 'axios';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function refreshToken() {

    console.log("Refreshing token")
    
    const refreshToken = localStorage.getItem('refreshToken')       

     if (!refreshToken) {
        return;
     }

    return axios.post(`${SERVER_BASIC_URL}/refresh`, {          //se c'è il refsresh token invio richiesta di refresh al mio server
                refreshToken
            })
            .then( res => {
                console.log("New AccessToken: ", res.data)
                localStorage.setItem('expiresIn', res.data.expiresIn)           //il server risponde con il nuovo accessToken e lo metto nel local storage
                localStorage.setItem('accessToken', res.data.accessToken)
            })
            .catch((err) => {
                console.log(err)
            })

}

