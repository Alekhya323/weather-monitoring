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
