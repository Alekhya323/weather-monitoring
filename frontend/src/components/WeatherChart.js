import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const WeatherChart = ({ summaries }) => {
  return (
    <div>
      <h2>Weather Trend</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={summaries.map((summary) => ({
            date: summary.date.toLocaleDateString(),
            avgTemp: summary.avgTemp,
            maxTemp: summary.maxTemp,
            minTemp: summary.minTemp
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avgTemp" stroke="#8884d8" />
          <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" />
          <Line type="monotone" dataKey="minTemp" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
