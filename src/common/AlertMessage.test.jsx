import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertMessage from './AlertMessage'; // Adjust the import path as necessary

describe('AlertMessage', () => {
  test('renders without errors', () => {
    render(<AlertMessage alertType="danger" errors={[]} />);
    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toHaveClass('alert-danger');
    expect(alertDiv.querySelectorAll('p')).toHaveLength(0);
  });

  test('renders multiple error messages', () => {
    const errors = ['Error one', 'Error two'];
    render(<AlertMessage alertType="warning" errors={errors} />);
    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toHaveClass('alert-warning');
    expect(screen.getByText('Error one')).toBeInTheDocument();
    expect(screen.getByText('Error two')).toBeInTheDocument();
    expect(alertDiv.querySelectorAll('p')).toHaveLength(2);
  });

  test('formats error messages correctly', () => {
    const errors = ['instance.Error one', 'instance.error two'];
    render(<AlertMessage alertType="success" errors={errors} />);
    expect(screen.getByText('Error one')).toBeInTheDocument();
    expect(screen.getByText('Error two')).toBeInTheDocument();
  });

  test('handles non-array errors gracefully', () => {
    render(<AlertMessage alertType="info" errors="single error" />);
    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toHaveClass('alert-info');
    expect(alertDiv).toBeEmptyDOMElement(); 
  });

});
