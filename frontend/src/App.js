import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,    // Import the CategoryScale
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,   // Register CategoryScale
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [weatherSummaries, setWeatherSummaries] = useState([]);

  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
  const [selectedCity, setSelectedCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('');
  const [unit, setUnit] = useState('C'); // C for Celsius, F for Fahrenheit

  const apiKey = '4e7d370f3068e6c5293198709e73f4e2'; // Replace with your OpenWeatherMap API key
  useEffect(() => {
    fetchWeatherSummaries();
  }, []);

  const fetchWeatherSummaries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/weather-summary');
      setWeatherSummaries(res.data);
    } catch (error) {
      console.error('Error fetching weather summaries', error);
    }
  };

  const chartData = {
    labels: weatherSummaries.map(summary => summary.date),
    datasets: [
      {
        label: 'Avg Temperature',
        data: weatherSummaries.map(summary => summary.avg_temp),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Max Temperature',
        data: weatherSummaries.map(summary => summary.max_temp),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Min Temperature',
        data: weatherSummaries.map(summary => summary.min_temp),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
    ],
  };
  

  // Fetch weather data when a city is selected
  const fetchWeather = async (city) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      try {
        const response = await axios.get(url);
        setTemperature(response.data.main.temp); // Setting temperature in Celsius
        setWeatherCondition(response.data.weather[0].main);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
  };

  // Convert Celsius to Fahrenheit and vice versa
  const convertTemperature = () => {
    if (unit === 'C') {
      // Convert Celsius to Fahrenheit
      setTemperature((prevTemp) => (prevTemp * 9) / 5 + 32);
      setUnit('F');
    } else {
      // Convert Fahrenheit to Celsius
      setTemperature((prevTemp) => ((prevTemp - 32) * 5) / 9);
      setUnit('C');
    }
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setTemperature(null); // Reset the temperature on city change
    fetchWeather(event.target.value)
  };
  return (
    <div className="App">
      <h1>Weather Monitoring</h1>
      <label>Select a City: </label>
      <select value={selectedCity} onChange={handleCityChange}>
        <option value="" disabled>Select a city</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>

      {temperature !== null && (
        <div>
          <h2>
            Current Temperature in {selectedCity}: {temperature.toFixed(2)}°{unit}
          </h2>
          <h3>Weather Condition: {weatherCondition}</h3> 
          <button onClick={convertTemperature}>
            Convert to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
      )}
      {weatherSummaries && <Line data={chartData} />}
    </div>
  );
}

export default App;
