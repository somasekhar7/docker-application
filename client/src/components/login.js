import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Tab,
  Nav,
  FloatingLabel,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_ENDPOINT } from "../constants";

const AuthTabs = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_API_ENDPOINT}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("email", loginEmail);
        setIsLoggedIn(true);
        navigate("/home");
        // Redirect or perform other actions upon successful login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_API_ENDPOINT}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dob, // Make sure to include dob
          email: signupEmail,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        //Clear form fields upon successful signup
        setFirstName("");
        setLastName("");
        setDob("");
        setSignupEmail("");
        setPassword("");
        setConfirmPassword("");
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("email", signupEmail);
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Container
      className="py-5 mt-5 mb-5"
      style={{
        boxShadow: "5px 5px 20px rgba(12,12,12,0.5)", // Default shadow
        boxShadowLeft: "10px 0px 10px rgba(0,0,0,0.1)", // Shadow on the left
        boxShadowBottom: "0px 10px 10px rgba(0,0,0,0.1)", // Shadow on the bottom
        boxShadowTop: "0px -10px 10px rgba(0,0,0,0.1)", // Shadow on the top
      }}
    >
      <Row className="justify-content-md-center">
        <Col xs={12} md={3}>
          <h2 className="mb-5" style={{ fontFamily: "Times-new-roman" }}>
            Create Account
          </h2>
          <Tab.Container
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="login">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="signup">Sign Up</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Form onSubmit={handleLogin}>
                  <FloatingLabel
                    controlId="floatingLoginEmail"
                    label="Email address"
                    className="mb-2 mt-3"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingLoginPassword"
                    label="Password"
                    className="mb-2"
                    style={{ position: "relative" }}
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{ paddingRight: "3.5rem" }}
                      required
                    />
                    <div
                      className="show-hide-password"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "1rem",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </FloatingLabel>
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <Form onSubmit={handleSignUp}>
                  <FloatingLabel
                    controlId="floatingFirstName"
                    label="First Name"
                    className="mb-2 mt-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingLastName"
                    label="Last Name"
                    className="mb-2"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingDOB"
                    label="Date of Birth"
                    className="mb-2"
                  >
                    <Form.Control
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingSignupEmail"
                    label="Email address"
                    className="mb-2"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingSignupPassword"
                    label="Password"
                    className="mb-2"
                    style={{ position: "relative" }}
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: "3.5rem" }}
                      required
                    />
                    <div
                      className="show-hide-password"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "1rem",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingConfirmPassword"
                    label="Confirm Password"
                  >
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingRight: "3.5rem" }}
                      required
                    />
                    <div
                      className="show-hide-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "1rem",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </FloatingLabel>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-2 d-flex justify-content-center"
                  >
                    Sign Up
                  </Button>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default AuthTabs;
