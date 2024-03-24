import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Table } from "react-bootstrap";
import Chart from "chart.js/auto";
import "./ExternalApi.css";

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://ai-weather-by-meteosource.p.rapidapi.com/hourly",
          {
            params: {
              lat: "37.81021",
              lon: "-122.42282",
              timezone: "auto",
              language: "en",
              units: "auto",
            },
            headers: {
              "X-RapidAPI-Key":
                "da5571125emsh6db317cd277ce9dp167aa3jsnb1338bf460f4",
              "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
            },
          }
        );
        console.log(response.data);
        setWeatherData(response.data.hourly.data || []);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (weatherData.length > 0) {
      // Data for the graph
      const labels = weatherData.map((entry) => entry.date);
      const temperatures = weatherData.map((entry) => entry.temperature);

      // Destroy previous Chart instance if exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create the graph
      const ctx = document.getElementById("weatherGraph").getContext("2d");
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatures,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
                font: {
                  size: 16, // Adjust the font size for the X axis title
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Temperature (°C)",
                font: {
                  size: 16, // Adjust the font size for the Y axis title
                },
              },
              beginAtZero: false,
            },
          },
        },
      });
    }
  }, [weatherData]);

  return (
    <Container fluid className="weather-container">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={8}>
          <h1 className="text-center mb-4">Weather Data From RapidAPI</h1>
          <Table striped bordered hover responsive className="weather-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Temperature (°C)</th>
                <th>Weather</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((current_entry, index) => (
                <tr key={index}>
                  <td>{current_entry.date}</td>
                  <td>{current_entry.temperature}</td>
                  <td>{current_entry.weather}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={8}>
          <div className="weather-graph-container">
            <canvas id="weatherGraph" width="400" height="200"></canvas>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherData;
