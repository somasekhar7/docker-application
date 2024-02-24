import "./App.css";
import Addition from "./components/Addition";
import MainContent from "./components/MainContent";
import NavBar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/home" element={<MainContent />} />
        <Route path="/add" element={<Addition />} />
      </Routes>
    </div>
  );
}

export default App;
