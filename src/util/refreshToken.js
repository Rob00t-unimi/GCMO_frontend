import axios from 'axios';

const SERVER_BASIC_URL = 'http://localhost:9000';

export default function refreshToken() {
    
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
        window.location='/login';
        return;
    }
    return axios.post(`${SERVER_BASIC_URL}/refresh`, {
                refreshToken
            })
            .then( res => {
                console.log(res.data)
                localStorage.setItem('expiresIn', res.data.expiresIn)
                localStorage.setItem('accessToken', res.data.accessToken)
            })
            .catch((err) => {
                console.log(err)
            })

}

