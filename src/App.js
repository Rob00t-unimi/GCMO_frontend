import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import PersonalArea from "./pages/personalArea/personalArea"
import IndexPage from "./pages/indexPage/indexPage"
import NavigationPage from "./pages/navigationPage/navigationPage"
import SetPreferencesPage from "./pages/setPreferencesPage";
import ToastNotify from "./components/toastNotify/toastNotify"


function App() {

  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")

  const setToast = ({show, text}) => { 
  setShowToast(show)
  setToastText(text)
}


  return (
    <Router>
      <div id="container">
        
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/personalArea" element ={<PersonalArea />} />
            <Route path="/navigate" element ={<NavigationPage />} />
            <Route path="/preferences" element ={<SetPreferencesPage/>}/>
          </Routes>

          <ToastNotify show={showToast} onClose={()=>setShowToast(false)} text={toastText}/>
      </div>
    </Router>
  );
}

export default App;




