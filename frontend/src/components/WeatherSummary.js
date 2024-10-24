import React from "react";

const WeatherSummary = ({ summaries }) => {
  return (
    <div>
      <h2>Daily Weather Summary</h2>
      {summaries.length === 0 ? (
        <p>No summary available yet.</p>
      ) : (
        <ul>
          {summaries.map((summary, index) => (
            <li key={index}>
              <p>Date: {summary.date.toLocaleDateString()}</p>
              <p>Average Temperature: {summary.avgTemp.toFixed(2)} °C</p>
              <p>Max Temperature: {summary.maxTemp.toFixed(2)} °C</p>
              <p>Min Temperature: {summary.minTemp.toFixed(2)} °C</p>
              <p>Dominant Condition: {summary.dominantCondition}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherSummary;
