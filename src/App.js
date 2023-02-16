
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React, { createContext, useState, useEffect, useContext } from 'react'


import PersonalArea from "./pages/personalArea/personalArea"
import IndexPage from "./pages/indexPage/indexPage"
import NavigationPage from "./pages/navigationPage/navigationPage"
import SetPreferencesPage from "./pages/setPreferencesPage/setPreferencesPage";
import ToastNotify from "./components/toastNotify/toastNotify"
import { spotifyApi } from './util/costanti';

//creazione del context
export const ToastContext = React.createContext();

function App() {

  //Set di spotifyApi con l'accessToken corrente    
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {

          console.log("AccessToken setting...")
          spotifyApi.setAccessToken(localStorage.getItem('accessToken'));
          console.log("AccessToken setted:", localStorage.getItem('accessToken'))
          
        }
    }, [localStorage.getItem('accessToken')])




  //states da passare a ToastNotify
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")

  //funzione per modificare entrambi gli states
  function setToast(show, text) {
    setShowToast(show)
    setToastText(text)
  }


  return (
  <>
    <ToastContext.Provider value={ {setToast} }>
      <ToastNotify showToast={showToast} onClose={()=>{setShowToast(false)}} toastText={toastText}/>
      <Router>
        <div id="container">
          
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/personalArea" element ={<PersonalArea />} />
              <Route path="/navigate" element ={<NavigationPage />} />
              <Route path="/preferences" element ={<SetPreferencesPage/>}/>
            </Routes>
        </div>
      </Router>
      </ToastContext.Provider>
    </>
  );
}

export default App;




