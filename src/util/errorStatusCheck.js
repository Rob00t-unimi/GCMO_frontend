import refreshToken from "./refreshToken";

export default function ErrorStatusCheck(errore, changeAccessToken) {

    if(!errore.body) return
    if(!errore.body.error) return
    
    console.log(errore.body.error.message);

    if (errore.body.error.status === 401 || errore.body.error.status === 403) {
        if(errore.body.error.status === 403){
            alert("L'utente corrente non ha i permessi per accedere al servizio richiesto.")
        }
        if(changeAccessToken){
            refreshToken(changeAccessToken)
        } else {
            refreshToken()
        }
    }

    if (errore.body.error.status === 429){
        console.log("Retry after ", errore.headers["retry_after"])
        alert("Sono state inviate troppe richieste, il traffico disponibile per la nostra applicazione è limitato. Riprovare più tardi.")
        setTimeout(() => {
           changeAccessToken()   //questo serve solo per cambiare lo stato di accessToken permettendomi di rieseguire le funzioni principali dopo il 429
           return
        }, errore.headers["retry_after"]*1000);
    }

    if (errore.body.error.status === 500 || errore.body.error.status === 502 || errore.body.error.status === 503){
        alert("Il server di Spotify ha riscontrato un problema. Prova a ricaricare la pagina riprova più tardi.")
        return
    }

    if (errore.body.error.status === 400){
        console.log("Richiesta non valida.")
        return
    }

    if (errore.body.error.status === 404){
        console.log("Servizio non disponibile.")
        return
    }    
}
