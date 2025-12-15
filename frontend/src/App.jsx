import React from "react";
import AuthProvider from "./context/AuthProvider";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/home.jsx";
import AuthPage from "./pages/Auth/AuthPage";
import Profile from "./pages/Profile/Profile";
import CreateProject from "./pages/CreateProject/CreateProject";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Notifications from "./pages/Notifications/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout لإدارة الـ Navbar وإخفائه حسب الصفحة
function Layout() {
  const location = useLocation();
  const hideNavbarPages = ["/"]; // الصفحات اللي ما بدك يظهر فيها الـ Navbar

  return (
    <>
      {!hideNavbarPages.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        
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
    </>
  );
}

function App() {
  return ( 
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
