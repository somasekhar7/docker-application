// import React from "react";
// import Navbar from "react-bootstrap/Navbar";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import logo from "./logo.png";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// function NavBar() {
//   return (
//     <Navbar
//       bg="black"
//       variant="dark"
//       expand="lg"
//       className="navbar-expand mb-3"
//     >
//       <Container>
//         <Navbar.Brand as={Link} to="/home">
//           <img
//             src={logo}
//             alt="Logo"
//             width="80"
//             height="80"
//             className="d-inline-block align-top logo"
//           />
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-nav" />
//         <Navbar.Collapse id="navbar-nav" className="justify-content-end">
//           <Nav className="ms-auto">
//             <Nav.Link as={Link} to="/home" className="nav-link text-white mr-7">
//               Home
//             </Nav.Link>
//             <Nav.Link as={Link} to="/add" className="nav-link text-white mr-7">
//               Add
//             </Nav.Link>
//             <Nav.Link
//               as={Link}
//               to="/external-api"
//               className="nav-link text-white mr-7"
//             >
//               API Data
//             </Nav.Link>
//             <Nav.Link as={Link} to="/inventory" className="nav-link text-white">
//               Inventory
//             </Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

import React, { useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import logo from "./logo.png"; // Import your logo image
function NavBar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    // Clear authentication state and sessionStorage
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
  };

  return (
    <Navbar
      bg="black"
      variant="dark"
      expand="lg"
      className="navbar-expand mb-3"
    >
      <Navbar.Brand as={Link} to="/home">
        <img
          src={logo}
          alt="Logo"
          width="80"
          height="80"
          className="d-inline-block align-top logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        {isLoggedIn ? (
          // Render navbar for logged-in user
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home" className="nav-link text-white mr-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/add" className="nav-link text-white mr-3">
              Add
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/external-api"
              className="nav-link text-white mr-3"
            >
              API Data
            </Nav.Link>
            <Nav.Link as={Link} to="/inventory" className="nav-link text-white">
              Inventory
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-link text-white">
              Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/login"
              className="nav-link text-white"
              onClick={handleLogout}
            >
              Logout
            </Nav.Link>
          </Nav>
        ) : (
          // Render navbar for guest user
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="nav-link text-white">
              Login/Signup
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
export default NavBar;
