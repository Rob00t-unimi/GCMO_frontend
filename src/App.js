
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React, { createContext, useState, useEffect, useContext } from 'react'


import PersonalArea from "./pages/personalArea/personalArea"
import IndexPage from "./pages/indexPage/indexPage"
import NavigationPage from "./pages/navigationPage/navigationPage"
import SetPreferencesPage from "./pages/setPreferencesPage/setPreferencesPage";
import ToastNotify from "./components/toastNotify/toastNotify"

export const ToastContext = React.createContext();

function App() {

  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")

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




