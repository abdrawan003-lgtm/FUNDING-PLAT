import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Layout from "./components/Layout"
import Footer from "./components/Footer/Footer";
import Projects from "./pages/Projects/project.jsx";
import Home from "./pages/Home/home.jsx";
import AuthPage from "./pages/Auth/AuthPage";
import Profile from "./pages/Profile/Profile";
import CreateProject from "./pages/CreateProject/CreateProject";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Notifications from "./pages/Notifications/Notifications";
import VerifySuccess from "./pages/Auth/VerifySuccess.jsx"
import ProtectedRoute from "./components/ProtectedRoute";
import './app.css'
import SavedProjects from "./pages/SavedProject/SavedProject.jsx";
export default function App() {
  return (
    <AuthProvider>
      <Router>
       
        <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/AuthPage" element={<AuthPage />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route element={<Layout />}>
         
            
        {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/notifications" element={<Notifications />} />
<Route path="/projects" element={<Projects />} />
          <Route path="/profile/:id"element={<ProtectedRoute> <Profile /></ProtectedRoute> }/>

          <Route path="/create-project"element={<ProtectedRoute><CreateProject /></ProtectedRoute> }/>

          <Route path="/project/:id" element={<ProjectDetails />} />
           <Route path="/saved-projects" element={<ProtectedRoute><SavedProjects /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        </Routes>

        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  );
}


