import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Flights from "./Pages/Flights";
import SignUp from "./Pages/SignUp";
import PrivateRoute from "./Components/PrivateRoute";
import {Navigate} from 'react-router-dom'

const App = () => {

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/flights" element={<PrivateRoute element={Flights} />} />
            {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
            {isAuthenticated && <Route path="*" element={<Navigate to="/flights" />} />}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
