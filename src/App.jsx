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