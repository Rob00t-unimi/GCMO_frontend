export default function Logout() {
    localStorage.removeItem('accessToken')
    //localStorage.removeItem('expiresAt')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location= '/'
}


//se faccio il logout svuoto il local storage
