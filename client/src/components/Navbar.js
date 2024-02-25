import React from "react";
import "./Navbar.css";
import logo from "./logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <header className="navbar">
        <Navbar bg="dark" data-bs-theme="dark">
          <Container style={{ alignItems: "center" }}>
            <img
              alt=""
              src={logo}
              width="100"
              height="100"
              className="d-inline-block align-top"
            />
            <Nav className="me-auto">
              <ul
                style={{
                  display: "flex",
                  listStyle: "none",
                  textAlign: "center",
                }}
              >
                <li className="item">
                  <Link
                    to="/home"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li className="item">
                  <Link to="/add" style={{ textDecoration: "none" }}>
                    Add
                  </Link>
                </li>
              </ul>
            </Nav>
          </Container>
        </Navbar>
      </header>
    </>
  );
}

export default NavBar;
