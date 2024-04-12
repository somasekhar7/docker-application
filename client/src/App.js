import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import AuthTabs from "./components/login";
import MainContent from "./components/MainContent";
import Addition from "./components/Addition";
import WeatherData from "./components/ExternalApi";
import InventoryManagement from "./components/InventoryItems";
import Profile from "./components/profile";
import { useAuth } from "./AuthContext";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      <NavBar />
      <Routes>
        {/* Redirect to login if not logged in */}
        {!isLoggedIn && <Route path="/" element={<AuthTabs />} />}
        {/* Redirect to home if already logged in */}
        {isLoggedIn && <Route path="/" element={<Navigate to="/home" />} />}
        {/* Public routes */}
        <Route path="/login" element={<AuthTabs />} />
        {/* Protected routes */}
        {isLoggedIn && (
          <>
            <Route path="/home" element={<MainContent />} />
            <Route path="/add" element={<Addition />} />
            <Route path="/external-api" element={<WeatherData />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
