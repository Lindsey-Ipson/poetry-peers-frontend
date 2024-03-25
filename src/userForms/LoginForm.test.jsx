import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mocking the login function
const mockLogin = jest.fn();

describe('LoginForm', () => {
  test('renders LoginForm correctly', () => {
    render(
      <Router>
        <LoginForm login={mockLogin} />
      </Router>
    );

    // Check if the form inputs are rendered
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument();
  });

});
