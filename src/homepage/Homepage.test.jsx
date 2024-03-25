import React from 'react';
import { render, screen } from '@testing-library/react';
import Homepage from './Homepage';

describe('Homepage', () => {
  test('renders with welcome message', () => {
    render(<Homepage />);
    expect(screen.getByText(/Welcome to Poetry Peers!/i)).toBeInTheDocument();
  });

  test('renders instructions for users', () => {
    render(<Homepage />);
    const instructions = [
      "Start analyzing poetry alongside the Poetry Peers community today!",
      "Explore new poems in the Poems tab, where you can read twenty new random poems each time, or search by poem title.",
      "If you find any themes you'd like to tag in any poem, simply highlight the relevant lines and provide your analysis for other members to see!",
      "You can also explore different themes or search for specific themes others have tagged in the Themes tab.",
      "To review or delete tags you've made, see the Contributions tab."
    ];

    instructions.forEach(instruction => {
      expect(screen.getByText(instruction)).toBeInTheDocument();
    });
  });
  
});
