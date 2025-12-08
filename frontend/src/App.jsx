import React from "react";
import AuthProvider from "./context/AuthProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/home.jsx";
import AuthPage from "./pages/Auth/AuthPage";
import Profile from "./pages/Profile/Profile";
import CreateProject from "./pages/CreateProject/CreateProject";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Notifications from "./pages/Notifications/Notifications";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return ( 
    <AuthProvider>
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<AuthPage />} />
           <Route path="/home" element={<Home />} />
             <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />   
         
          {/* صفحات محمية */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/create-project" 
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            } 
          />

          <Route path="/project/:id" element={<ProjectDetails />} />
 <Route path="*" element={<Navigate to="/" />} />
        </Routes>
       

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
