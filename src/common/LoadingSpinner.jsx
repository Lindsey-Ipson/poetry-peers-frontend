import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="LoadingSpinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;