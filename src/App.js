import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'


import PersonalArea from "./pages/personalArea/personalArea"
import IndexPage from "./pages/indexPage/indexPage"
import NavigationPage from "./pages/navigationPage/navigationPage"

function App() {

  return (
    <Router>
      <div id="container">
        
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/personalArea" element ={<PersonalArea />} />
            <Route path="/navigate" element ={<NavigationPage />} />
            
          </Routes>

      </div>
    </Router>
  );
}

export default App;


