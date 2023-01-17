export default function Logout() {
    localStorage.removeItem('accessToken')
    //localStorage.removeItem('expiresAt')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('refreshToken')

    window.location= '/'
}

