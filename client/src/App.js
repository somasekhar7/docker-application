import "./App.css";
import Addition from "./components/Addition";
import MainContent from "./components/MainContent";
import NavBar from "./components/Navbar";
import WeatherData from "./components/ExternalApi";
import InventoryManagement from "./components/InventoryItems";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/home" element={<MainContent />} />
        <Route path="/add" element={<Addition />} />
        <Route path="/external-api" element={<WeatherData />} />
        <Route path="/inventory" element={<InventoryManagement />} />
      </Routes>
    </div>
  );
}

export default App;
