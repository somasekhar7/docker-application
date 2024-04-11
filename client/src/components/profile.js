import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const sessionEmail = sessionStorage.getItem("email");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5005/api/profile/${sessionEmail}`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedDOB = new Date(data.dob).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setUserDetails({ ...data, dob: formattedDOB });
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserDetails();
  }, [sessionEmail]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">User Profile</h2>
              <Row>
                <Col>
                  <p>
                    <strong>First Name:</strong> {userDetails.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {userDetails.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {userDetails.email}
                  </p>
                  <p>
                    <strong>DOB:</strong> {userDetails.dob}
                  </p>
                </Col>
              </Row>
              {/* Display other user details as needed */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
