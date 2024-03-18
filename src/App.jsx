import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import RoutesList from './RoutesList';
import NavBar from './nav/NavBar';
import BackendApi from './common/backendApi';
import LoadingSpinner from './common/LoadingSpinner';
import UserContext from './common/UserContext';
import useLocalStorageState from './hooks/useLocalStorageState';
import './App.css';

function App() {
	const [token, setToken] = useLocalStorageState('authToken');
	const [currentUser, setCurrentUser] = useState(null);
	const [userInfoLoaded, setUserInfoLoaded] = useState(false);

	useEffect(() => {
		async function getCurrentUser() {
			if (token) {
				try {
					let { username } = jwtDecode(token);
					BackendApi.token = token;
					let currentUser = await BackendApi.getCurrentUser(username);
					setCurrentUser(currentUser);
				} catch (err) {
					setCurrentUser(null);
				}
			}
			setUserInfoLoaded(true);
		}
		setUserInfoLoaded(false);
		getCurrentUser();
	}, [token]);

	async function login(data) {
		try {
			let token = await BackendApi.login(data);
			setToken(token);
			return { loggedIn: true };
		} catch (errs) {
			return { loggedIn: false, errs: errs };
		}
	}

	async function signup(data) {
		try {
			let token = await BackendApi.signup(data);
			setToken(token);
			return { signedUp: true };
		} catch (errs) {
			return { signedUp: false, errs: errs };
		}
	}

	async function logout() {
		setCurrentUser(null);
		setToken(null);
	}

	if (!userInfoLoaded) return <LoadingSpinner />;

	return (
		<div className="App">
			<BrowserRouter>
				<UserContext.Provider value={{ currentUser, setCurrentUser }}>
					<NavBar logout={logout} />
					<RoutesList login={login} signup={signup} />
				</UserContext.Provider>
			</BrowserRouter>
		</div>
	);
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
