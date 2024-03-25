import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from '../common/UserContext';
import NavBar from './NavBar';

describe('NavBar', () => {
  const currentUser = { username: 'testuser' };
  const noCurrentUser = null;
  const logoutMock = jest.fn();

  it('renders with login and signup links when user is not logged in', () => {
    const { getByText } = render(
      <Router>
      <UserContext.Provider value={{ noCurrentUser }}>
        <NavBar />
      </UserContext.Provider>
    </Router>
    );

    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Signup')).toBeInTheDocument();
  });

  it('renders with poems, themes, and contributions links when user is logged in', () => {
    const { getByText } = render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <NavBar />
        </UserContext.Provider>
      </Router>
    );

    expect(getByText('Poems')).toBeInTheDocument();
    expect(getByText('Themes')).toBeInTheDocument();
    expect(getByText('Contributions')).toBeInTheDocument();
  });

  it('calls logout function when logout link is clicked', () => {
    const { getByText } = render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <NavBar logout={logoutMock} />
        </UserContext.Provider>
      </Router>
    );

    fireEvent.click(getByText('Logout testuser'));

    expect(logoutMock).toHaveBeenCalled();
  });

});