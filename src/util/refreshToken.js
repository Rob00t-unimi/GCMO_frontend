function RefreshToken() {
    
    const expiresAt = localStorage.getItem('expiresAt') - 1000*60*5     //metto un offset aòlla scadenza; lo faccio scadere 5 min prima
    
    if (Date.now() < expiresAt) {
        return
    }

    //procedura per il refresh

} 