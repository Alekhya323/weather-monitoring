import React from "react";

const Alert = ({ alerts }) => {
  return (
    <div>
      <h2>Alerts</h2>
      {alerts.length === 0 ? (
        <p>No alerts.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <p>{alert.time.toLocaleTimeString()}: {alert.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alert;
