//se faccio il logout svuoto il local storage tranne il valore visited

export default function Logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('playlist_list')
    window.location= '/'
}