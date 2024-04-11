import mypic from "./mypic.jpeg";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const MainContent = () => {
  // State variables for input text, edit mode, and initial value
  const [text, setText] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [initialBio, setInitialBio] = useState("");

  // Load initial value from localStorage on component mount
  useEffect(() => {
    const storedText = "DARISI VENKATA VEERA SOMASEKHAR";
    const storedBio =
      "I hold a Bachelor's degree in Computer Science from Anna University, where I graduated with honors. My undergraduate studies provided me with a solid foundation in fundamental computer science concepts, including data structures, algorithms, programming languages, and software engineering principles. As an MS student, I am eager to delve deeper into specialized areas of computer science and pursue advanced coursework in Machine Learning and Artificial Intelligence.";
    if (storedText || storedBio) {
      setInitialText(storedText);
      setText(storedText);
      setInitialBio(storedBio);
      setBio(storedBio);
    }
  }, []);

  // Handle input text change
  const handleNameChange = (event) => {
    setText(event.target.value);
  };
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };
  // Handle edit button click
  const handleEdit = () => {
    setEditMode(true);
  };

  // Handle save button click
  const handleSave = () => {
    localStorage.setItem("text", text);
    setInitialText(text);
    setEditMode(false);
    localStorage.setItem("bio", bio);
    setInitialBio(bio);
  };

  // Handle reset button click
  const handleReset = () => {
    setText(initialText);
    setBio(initialBio);
    setEditMode(false);
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col sm={12} md={6} lg={3}>
          <img src={mypic} alt="Profile Pic" className="profilepic img-fluid" />
        </Col>
        <Col sm={12} md={6} lg={9}>
          <div className="content">
            {/* Input field */}
            <input
              id="name"
              type="text"
              value={editMode ? text : initialText}
              onChange={handleNameChange}
              readOnly={!editMode}
              className="form-control mb-3"
              placeholder="Enter your name"
            />
            <textarea
              id="bio"
              name="bio"
              rows="7"
              value={editMode ? bio : initialBio}
              onChange={handleBioChange}
              readOnly={!editMode}
              className="form-control mb-3"
              placeholder="Enter your bio"
            ></textarea>

            {/* Buttons */}
            {editMode ? (
              <>
                <Button variant="primary" className="me-2" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainContent;
