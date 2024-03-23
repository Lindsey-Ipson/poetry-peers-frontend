import React from 'react';
// import { c } from 'vite/dist/node/types.d-FdqQ54oU';

// function AlertMessage({ alertType='primary', messages }) {
// 	const errorMessages = Array.isArray(messages) ? messages : [];
// 	console.log(messages, 'messages');
// 	console.log(errorMessages, 'errorMessages');
// 	return (
// 		<div
// 			className={`alert alert-${alertType} d-flex align-items-center justify-content-center`}
// 			role="alert"
// 		>
// 			{messages.map((msg) => (
// 				<p key={msg}>{msg}</p>
// 			))}
// 		</div>
// 	);
// }
// function AlertMessage({ alertType, errors }) {
//   // Ensure errs is always treated as an array
//   const errorMessages = Array.isArray(errors) ? errors : [];

// 	const formattedErrorMessages = errorMessages.map(error => {
// 		// Check and remove 'instance.' prefix if present
// 		const cleanedError = error.replace(/^instance\./, '');
// 		// Capitalize the first letter of the cleaned error message
// 		const result = cleanedError.charAt(0).toUpperCase() + cleanedError.slice(1);
// 		return result;
// 	});

//   return (
//     <div className={`alert alert-${alertType}`}>
//       {formattedErrorMessages.map((error, index) => (
//         <p key={index}>{error}</p>
//       ))}
//     </div>
//   );
// }
// function AlertMessage({ alertType, errs }) {
//   // Ensure errs is always treated as an array
//   const errorMessages = Array.isArray(errs) ? errs : [];
// 	console.log(errorMessages, 'errorMessages');

// 	for (let err of errorMessages) {
// 		console.log(err, 'err')
// 		if (err.includes('instance.')) {
// 			console.log('INCLUDES')
// 			err = err.slice(9);
// 			err = err.charAt(0).toUpperCase() + err.slice(1);
// 			console.log(err, 'err3');
// 		}
// 	}

//   return (
//     <div className={`alert alert-${alertType}`}>
//       {errorMessages.map((error, index) => (
//         <p key={index}>{error}</p>
//       ))}
//     </div>
//   );
// }
function AlertMessage({ alertType, errs }) {
  // Ensure errs is always treated as an array
  const errorMessages = Array.isArray(errs) ? errs : [];
  console.log(errorMessages, 'errorMessages');

  // Create a new array with the modified error messages
  const formattedErrors = errorMessages.map(err => {
    if (err.includes('instance.')) {
      let modifiedError = err.slice(9); // Remove 'instance.'
      modifiedError = modifiedError.charAt(0).toUpperCase() + modifiedError.slice(1); // Capitalize first letter
      return modifiedError;
    }
    return err; // Return unmodified error if it doesn't include 'instance.'
  });

  return (
    <div className={`alert alert-${alertType}`}>
      {formattedErrors.map((error, index) => (
        <p key={index}>{error}</p> // Use formattedErrors for rendering
      ))}
    </div>
  );
}




export default AlertMessage;
