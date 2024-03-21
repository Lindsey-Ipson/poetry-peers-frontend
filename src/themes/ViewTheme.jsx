import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function ViewTheme () {
	const navigate = useNavigate();
	const location = useLocation();
	const initialState = location.state?.data;

	return (
		<h1>Hi</h1>
	);
}

export default ViewTheme;




// Theme Name
// Components with poem title, author, releveant lines
