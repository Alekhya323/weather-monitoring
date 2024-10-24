require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from frontend
    credentials: true
}));


// Function to fetch weather data from OpenWeatherMap
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function fetchWeatherData(city) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;  // Metric for Celsius
    
    try {
        const response = await axios.get(url);
        console.log(response.data);
        const { temp, feels_like } = response.data.main;
        const weatherCondition = response.data.weather[0].main;
        const date = new Date(response.data.dt * 1000).toISOString().split('T')[0]; // Convert Unix timestamp to Date
        
        return { city, temp, feels_like, weatherCondition, date };
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error.message);
    }
}

// Store daily weather summary in MySQL
async function storeWeatherData(city, date, avgTemp, maxTemp, minTemp, dominantCondition) {
    const query = `INSERT INTO weather_summary (city, date, avg_temp, max_temp, min_temp, dominant_condition) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [city, date, avgTemp, maxTemp, minTemp, dominantCondition], (err, result) => {
        if (err) throw err;
        console.log(`Weather data stored for ${city} on ${date}`);
    });
}

// Function to calculate and roll up weather data
async function processWeatherData() {
    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            const { city, temp, weatherCondition, date } = weatherData;

            // Calculate max, min, avg temperature and dominant weather condition
            const avgTemp = temp; // Simplified for this case (fetch real-time temp)
            const maxTemp = temp; // For simplicity, using the current temp
            const minTemp = temp;
            const dominantCondition = weatherCondition;

            storeWeatherData(city, date, avgTemp, maxTemp, minTemp, dominantCondition);
        }
    }
}

// Function to trigger alerts based on thresholds
async function checkForAlerts() {
    const thresholdTemp = 35; // Example threshold
    const query = `SELECT * FROM weather_summary WHERE max_temp > ? ORDER BY date DESC LIMIT 2`;

    for (const city of cities) {
        db.query(query, [thresholdTemp], (err, result) => {
            if (err) throw err;

            if (result.length >= 2) {
                const alertMessage = `Temperature in ${city} exceeded ${thresholdTemp}°C for two consecutive days: ${result[0].date} and ${result[1].date}`;
                sendAlert(alertMessage, city);

                const alertQuery = `INSERT INTO alerts (alert_message, city) VALUES (?, ?)`;
                db.query(alertQuery, [alertMessage, city], (alertErr) => {
                    if (alertErr) throw alertErr;
                    console.log(`Alert triggered and stored for ${city}`);
                });
            }
        });
    }
}

// Helper function to send email alerts
function sendAlert(message, city) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ALERT_EMAIL,
        subject: `Weather Alert for ${city}`,
        text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log('Alert email sent:', info.response);
    });
}

// Schedule weather data processing every 5 minutes
setInterval(() => {
    processWeatherData();
    checkForAlerts();
}, 300000); // 5 minutes in milliseconds

// API endpoints for fetching weather data summaries
app.get('/api/weather-summary', (req, res) => {
    db.query('SELECT * FROM weather_summary ORDER BY date DESC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(5000, () => console.log('Server started on port 5000'));
