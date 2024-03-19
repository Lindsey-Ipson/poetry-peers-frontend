import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<App />
	// </React.StrictMode>
);

// Currently commenting out  React.StrictMode to prevent it from causing re-renders or double-invoking lifecycle methods like useEffect