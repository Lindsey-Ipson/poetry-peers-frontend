import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import LoginForm from './forms/LoginForm';
import SignupForm from './forms/SignupForm';
import EditProfileForm from './forms/EditProfileForm';
import UserContext from './common/UserContext';

function RoutesList({ login, signup }) {
	const { currentUser } = useContext(UserContext);
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="login" element={<LoginForm login={login} />} />
			<Route path="signup" element={<SignupForm signup={signup} />} />
			{currentUser && (
				<>
					{/* <Route path="poems-browse" element={<PoemsBrowse />} /> */}
					{/* <Route path="analyze-poem/:id" element={<AnalyzePoem />} /> */}
					{/* <Route path="themes-browse" element={<ThemeCardsList />} /> */}
					{/* <Route path="contributions" element={<Contributions />} /> */}
					<Route path="profile" element={<EditProfileForm />} />
				</>
			)}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

export default RoutesList;
