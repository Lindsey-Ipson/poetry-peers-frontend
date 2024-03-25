import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupForm from './SignupForm';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mocking the signup function
const mockSignup = jest.fn();

describe('SignupForm', () => {
  test('renders SignupForm correctly', () => {
    render(<SignupForm signup={mockSignup} />);

    // Check if the input fields are rendered
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /Sign Up/ })).toBeInTheDocument();
  });

});
