import React from 'react';

function AlertMessage({ alertType, errors }) {
  // Ensure errors is always treated as an array
  const errorMessages = Array.isArray(errors) ? errors : [];

  // Create a new array with the modified error messages
  const formattedErrors = errorMessages.map(err => {
    if (err.includes('instance.')) {
      let modifiedError = err.slice(9); // Remove 'instance.' if included in error
      modifiedError = modifiedError.charAt(0).toUpperCase() + modifiedError.slice(1); // Capitalize first letter
      return modifiedError;
    }
    return err;
  });

  return (
    <div className={`alert alert-${alertType}`} role="alert">
      {formattedErrors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
}

export default AlertMessage;