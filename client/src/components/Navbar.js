import React from "react";
import "./Navbar.css";
import logo from "./logo.jpeg";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar">
      <div>
        <img src={logo} alt="logo" className="logo" />
      </div>
      <h4>Welcome</h4>
      <ul className="nav-links">
        <li className="item">
          <Link to="/home">Home</Link>
        </li>
        <li className="item">
          <Link to="/add">Add</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
