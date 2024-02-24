import "./Addition.css";
import React, { useState } from "react";

function Addition() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);
  const [serverResult, setServerResult] = useState(0);

  const handleSubmit = (e) => {
    const sum = parseInt(num1) + parseInt(num2);
    setResult(sum);
    e.preventDefault();
    handleAddition();
  };

  const handleAddition = async () => {
    try {
      const response = await fetch(
        "http://ec2-18-118-211-124.us-east-2.compute.amazonaws.com:5001/api/addition",
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
    <div className="addition">
      <div className="input-container1">
        <label htmlFor="num1">Enter First Number:</label>
        <input
          type="number"
          id="num1"
          placeholder="Enter first number"
          onChange={(e) => setNum1(parseInt(e.target.value))}
        />
      </div>
      <br />
      <br />
      <div className="input-container2">
        <label htmlFor="num2">Enter Second Number:</label>
        <input
          type="number"
          id="num2"
          placeholder="Enter second number"
          onChange={(e) => setNum2(parseInt(e.target.value))}
        />
      </div>
      <br />
      <br />
      <button onClick={handleSubmit} id="submit">
        Calculate
      </button>
      <div>
        <h3 id="result1">The Result from ReactJs :{result}</h3>
        <h3 id="result2">The Result from Server:{serverResult}</h3>
      </div>
    </div>
  );
}

export default Addition;
