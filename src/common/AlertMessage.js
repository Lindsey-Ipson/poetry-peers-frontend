import React from 'react';

function AlertMessage({ alertType='primary', messages }) {
	return (
		<div
			className={`alert alert-${alertType} d-flex align-items-center justify-content-center`}
			role="alert"
		>
			{messages.map((msg) => (
				<p key={msg}>{msg}</p>
			))}
		</div>
	);
}

export default AlertMessage;
