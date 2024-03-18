import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import UserContext from '../common/UserContext';
import './navbar.css';
import { Collapse } from 'bootstrap';

function NavBar({ logout }) {
	const { currentUser } = useContext(UserContext);

	const [isNavCollapsed, setIsNavCollapsed] = useState(true);
	const [navbarCollapse, setNavbarCollapse] = useState(null);

	useEffect(() => {
		const elem = document.getElementById('navbarToggle');
		const bsCollapse = new Collapse(elem, { toggle: false });
		setNavbarCollapse(bsCollapse);
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
		<nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
			<div className="container-fluid">
				<NavLink to="/" className="navbar-brand">
					Jobly
				</NavLink>

				<button
					onClick={handleNavbarToggler}
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarToggle"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarToggle">
					{/* <form class="d-flex" role="search"> */}
					<ul className="navbar-nav ml-auto">
						{currentUser ? loggedInNavBarItems : loggedOutNavBarItems}
					</ul>
					{/* </form> */}
				</div>
			</div>
		</nav>
	);

	return navBar;
}

export default NavBar;
