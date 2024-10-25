# Weather Monitoring and Alert System
This project is a Weather Monitoring and Alert System that fetches real-time weather data for several cities, stores the data in a MySQL database, and triggers email alerts when weather conditions exceed specified thresholds.

**Features**
* Fetches weather data for major cities using the OpenWeatherMap API.
* Stores daily weather summaries (average temperature, max/min temperature, dominant weather condition) in a MySQL database.
* Triggers email alerts when temperature exceeds a threshold for two consecutive days.
* Provides an API endpoint to fetch weather summaries.
* Automates weather data collection and alert checks every 5 minutes.

**Technologies Used**
* Node.js and Express for the backend.
* MySQL for storing weather data.
* Axios for making HTTP requests to the OpenWeatherMap API.
* Nodemailer for sending email alerts.
* dotenv for environment variable management.
* Cors for cross-origin requests.

**Prerequisites**
Ensure you have the following installed on your system:

* Node.js (v14 or higher)
* npm (Node Package Manager)
* MySQL database

**Setup**
1. Clone the Repository
```javascript
git clone https://github.com/your-repo/weather-alert-system.git
cd weather-alert-system
```
1. Install Dependencies
```javascript
npm install
```
1. Create a `.env` File
Create a .env file in the root of the project and add the following environment variables:
```javascript
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

OPENWEATHER_API_KEY=your_openweathermap_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
ALERT_EMAIL=recipient_email@gmail.com
```
4. Set Up MySQL Database
Create a MySQL database and run the following SQL queries to create the necessary tables:
```javascript
CREATE TABLE weather_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    date DATE,
    avg_temp FLOAT,
    max_temp FLOAT,
    min_temp FLOAT,
    dominant_condition VARCHAR(100)
);

CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_message TEXT,
    city VARCHAR(100),
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
1. Start the Server
Run the following command to start the server:
```javascript
node index.js
```
The server will start on http://localhost:5000.

1. Schedule Weather Data Processing
The system is configured to fetch weather data and check for alerts every 5 minutes. This is done using setInterval in the code:
```javascript
setInterval(() => {
    processWeatherData();
    checkForAlerts();
}, 300000); // 5 minutes in milliseconds
```
**API Endpoints**
1. Get Weather Summary
* Endpoint: /api/weather-summary
* Method: GET
* Description: Fetches all weather summaries stored in the MySQL database.
* Response: Array of weather summaries with city, date, average temperature, max/min temperature, and dominant weather condition.
```javascript
[
    {
        "id": 1,
        "city": "Delhi",
        "date": "2023-10-15",
        "avg_temp": 34.5,
        "max_temp": 36.7,
        "min_temp": 32.1,
        "dominant_condition": "Clear"
    },
    {
        "id": 2,
        "city": "Mumbai",
        "date": "2023-10-15",
        "avg_temp": 29.3,
        "max_temp": 31.0,
        "min_temp": 28.1,
        "dominant_condition": "Clouds"
    }
]
```
**How the System Works**
1. Fetch Weather Data
The application fetches real-time weather data for predefined cities (Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad) using the OpenWeatherMap API. It collects information about temperature, weather conditions, and the date of data collection.

1. Store Weather Data
The fetched data is processed and stored in the weather_summary table of the MySQL database. The average, maximum, and minimum temperatures, as well as the dominant weather condition, are stored for each city.

1. Check for Alerts
The system checks if the temperature in any city exceeds a specified threshold (e.g., 35°C) for two consecutive days. If this condition is met, an alert is triggered, and an email is sent to the specified recipient.

1. Send Alerts
The system uses Nodemailer to send email alerts if the conditions for an alert are met. Alerts are stored in the alerts table for record-keeping.

***Customization***
You can easily customize the system by:

* Adding more cities: Update the cities array to include more cities.
* Changing the alert threshold: Modify the thresholdTemp variable to set a different temperature threshold.
* Changing the alert frequency: Adjust the time interval in setInterval for more frequent or less frequent checks.
**License**
This project is open-source and available for modification or use under the terms of the MIT License.
* With this setup, you can monitor weather conditions and receive timely alerts for any unusual temperature spikes in the listed cities


