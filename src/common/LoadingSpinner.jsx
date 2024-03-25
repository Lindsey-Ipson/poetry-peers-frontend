import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="LoadingSpinner">
      <div className="spinner" role="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;