import refreshToken from "./refreshToken";
export default function ErrorStatusCheck(errore) {
    console.log(errore.body.error.message);
    const status = errore.body.error.status;

    if (errore.body.error.status === 401 || errore.body.error.status === 403) {
        refreshToken()
        return "401-403"
    }
    
    //aggiungere un controllo quando error status è 429 ovvero troope richieste 
    //per non inviare più richieste fino allo scadere del tempo di attesa restituito
    
}
