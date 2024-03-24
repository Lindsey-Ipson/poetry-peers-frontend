import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import UserContext from '../common/UserContext';
import { Collapse } from 'bootstrap';
import './NavBar.css';

function NavBar({ logout }) {
	const { currentUser } = useContext(UserContext);

	const [navbarCollapse, setNavbarCollapse] = useState(null);

	useEffect(() => {
		function initializeNavbarCollapse() {
			const elem = document.getElementById('navbarToggle');
			const bsCollapse = new Collapse(elem, { toggle: false });
			setNavbarCollapse(bsCollapse);
		}

		initializeNavbarCollapse();
	}, []);
	

	const handleNavbarToggler = () => {
		navbarCollapse.toggle();
	};

	const loggedInNavBarItems = (
		<>
			<li className="nav-item">
				<NavLink to="/poems" className="nav-link">
					Poems
				</NavLink>
			</li>
			<li className="nav-item">
				<NavLink to="/themes" className="nav-link">
					Themes
				</NavLink>
			</li>
			<li className="nav-item">
				<NavLink to="/contributions" className="nav-link">
					Contributions
				</NavLink>
			</li>
			<li className="nav-item">
				<NavLink to="/" onClick={logout} className="nav-link">
					Logout {currentUser && currentUser.username}
				</NavLink>
			</li>
		</>
	);

	const loggedOutNavBarItems = (
		<>
			<li className="nav-item">
				<NavLink to="/login" className="nav-link">
					Login
				</NavLink>
			</li>
			<li className="nav-item">
				<NavLink to="/signup" className="nav-link">
					Signup
				</NavLink>
			</li>
		</>
	);

	const navBar = (
		<nav className="NavBar navbar navbar-expand-md navbar-light bg-light fixed-top">
			<div className="container-fluid">
				<NavLink to="/" className="navbar-brand">
          <img src="/FountainPenTip.jpg" alt="logo" className="NavBar-logo"/>
          Poetry Peers
        </NavLink>
				<button
					onClick={handleNavbarToggler}
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarToggle"
					aria-controls="navbarToggle"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
	
				<div className="collapse navbar-collapse justify-content-end" id="navbarToggle">
					<ul className="navbar-nav">
						{currentUser ? loggedInNavBarItems : loggedOutNavBarItems}
					</ul>
				</div>
			</div>
		</nav>
	);
	
	return navBar;
	
}

export default NavBar;