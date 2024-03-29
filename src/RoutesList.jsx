import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import LoginForm from './userForms/LoginForm';
import SignupForm from './userForms/SignupForm';
import EditProfileForm from './userForms/EditProfileForm';
import UserContext from './common/UserContext';
import PoemExplorer from './poems/PoemExplorer';
import AnalyzePoem from './poems/AnalyzePoem';
import CreateTagForm from './poems/CreateTagForm';
import ThemeExplorer from './themes/ThemeExplorer';
import Contributions from './contributions/Contributions';
import ViewTheme from './themes/ViewTheme';

function RoutesList({ login, signup }) {
	const { currentUser } = useContext(UserContext);
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="login" element={<LoginForm login={login} />} />
			<Route path="signup" element={<SignupForm signup={signup} />} />
			{currentUser && (
				<>
					<Route path="poems" element={<PoemExplorer />} />
					<Route path="poems/:poemId" element={<AnalyzePoem />} />
					<Route path="contributions" element={<Contributions />} />
					<Route path="poems/CreateTagForm" element={<CreateTagForm />} />
					<Route path="themes" element={<ThemeExplorer />} />
					<Route path="themes/:themeName" element={<ViewTheme />} />
					<Route path="profile" element={<EditProfileForm />} />
				</>
			)}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

export default RoutesList;