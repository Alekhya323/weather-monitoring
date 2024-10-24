
import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherSummary from "./components/WeatherSummary.js";
import Alert from "./components/Alert.js";
import WeatherChart from "./components/WeatherChart.js";

// List of cities in India
// 
const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"]

const API_KEY = "4e7d370f3068e6c5293198709e73f4e2"; // Add your OpenWeatherMap API Key

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summaries, setSummaries] = useState([]);

  // Fetch weather data from OpenWeatherMap API for each city
  const fetchWeatherData = async () => {
    const fetchedData = [];
    for (let city of cities) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`
      );
      console.log("response",response)
      const data = response.data;

      const tempCelsius = data.main.temp - 273.15;
      const feelsLikeCelsius = data.main.feels_like - 273.15;

      fetchedData.push({
        city: city.name,
        temp: tempCelsius,
        feelsLike: feelsLikeCelsius,
        main: data.weather[0].main,
        time: new Date(data.dt * 1000)
      });
    }

    setWeatherData(fetchedData);
    processSummaries(fetchedData);
    checkForAlerts(fetchedData);
  };

  // Process daily weather summaries
  const processSummaries = (data) => {
    const summary = data.reduce(
      (acc, curr) => {
        acc.tempSum += curr.temp;
        acc.maxTemp = Math.max(acc.maxTemp, curr.temp);
        acc.minTemp = Math.min(acc.minTemp, curr.temp);
        acc.conditionCount[curr.main] = (acc.conditionCount[curr.main] || 0) + 1;
        return acc;
      },
      {
        tempSum: 0,
        maxTemp: -Infinity,
        minTemp: Infinity,
        conditionCount: {}
      }
    );

    const dominantCondition = Object.keys(summary.conditionCount).reduce((a, b) =>
      summary.conditionCount[a] > summary.conditionCount[b] ? a : b
    );

    const avgTemp = summary.tempSum / data.length;
    setSummaries((prevSummaries) => [
      ...prevSummaries,
      {
        date: new Date(),
        avgTemp,
        maxTemp: summary.maxTemp,
        minTemp: summary.minTemp,
        dominantCondition
      }
    ]);
  };

  // Check for alerts based on temperature thresholds
  const checkForAlerts = (data) => {
    const highTempCities = data.filter((city) => city.temp > 35);
    if (highTempCities.length > 0) {
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        {
          time: new Date(),
          message: `High temperature alert! Cities: ${highTempCities
            .map((city) => city.name)
            .join(", ")}`
        }
      ]);
    }
  };

  // Fetch data every 5 minutes
  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Real-Time Weather Monitoring</h1>
      <WeatherSummary summaries={summaries} />
      <WeatherChart summaries={summaries} />
      <Alert alerts={alerts} />
    </div>
  );
};

export default App;
