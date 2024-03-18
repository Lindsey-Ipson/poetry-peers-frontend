import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../common/UserContext";
import "./navbar.css";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  const loggedInNavBar = (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          Poetry Peers
        </NavLink>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
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
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/" onClick={logout} className="nav-link">
                Logout {currentUser && currentUser.username}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );

  const loggedOutNavBar = (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          Poetry Peers
        </NavLink>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
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
          </ul>
        </div>
      </div>
    </nav>
  );

  return currentUser ? loggedInNavBar : loggedOutNavBar;
}

export default NavBar;