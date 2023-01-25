import refreshToken from "./refreshToken";
export default function ErrorStatusCheck(errore) {
    console.log(errore.body.error.message);
    const status = errore.body.error.status;

    if (errore.body.error.status === 401 || errore.body.error.status === 403) {
        refreshToken()
    }
    
    
}
