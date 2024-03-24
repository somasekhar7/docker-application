import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function Addition() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);
  const [serverResult, setServerResult] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sum = parseInt(num1) + parseInt(num2);
    setResult(sum);
    await handleAddition(sum);
  };

  const handleAddition = async (sum) => {
    try {
      const response = await fetch(
        "http:ec2-18-223-28-39.us-east-2.compute.amazonaws.com:5005/api/addition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ num1: parseInt(num1), num2: parseInt(num2) }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add numbers");
      }
      const data = await response.json();
      setServerResult(data.result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Container className="addition mt-3">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Enter First Number:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter first number"
              value={num1}
              onChange={(e) => setNum1(parseInt(e.target.value))}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Enter Second Number:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter second number"
              value={num2}
              onChange={(e) => setNum2(parseInt(e.target.value))}
            />
          </Form.Group>
        </Row>
        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          style={{ marginBottom: "20px" }}
        >
          Calculate
        </Button>
      </Form>
      <Row>
        <Col>
          <h3>The Result from ReactJs: {result}</h3>
        </Col>
        <Col>
          <h3>The Result from Server: {serverResult}</h3>
        </Col>
      </Row>
    </Container>
  );
}

export default Addition;
