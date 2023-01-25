export default function Logout() {
    localStorage.removeItem('accessToken')
    //localStorage.removeItem('expiresAt')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('playlist_list')
    window.location= '/'

}


//se faccio il logout svuoto il local storage
