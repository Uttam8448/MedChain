import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import {Routes,Route} from "react-router-dom";
import { createContext } from "react";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";

//creating context
const UserContext = createContext({
  token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
  user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,
});
//wrap all the child inside a provider


function App() {
  const [token,setToken] = useState(localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null)
  const [user,setUser]  = useState(localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null);

  return (
    <div className="flex flex-col min-h-screen min-w-screen background">
      <UserContext.Provider value={{token,setToken,user,setUser}}>
          <Navbar/>
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/contact" element={<Contact/>}/> 
              <Route path="/login" element={<LogIn />}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/dashboard" element={  <PrivateRoute> <Dashboard />  </PrivateRoute>}/>
          </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
export { UserContext }; // Exporting the context to use it in other components