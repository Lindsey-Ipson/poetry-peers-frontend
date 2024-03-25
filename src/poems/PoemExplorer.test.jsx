import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from '../common/UserContext';
import BackendApi from '../common/backendApi';
import PoemExplorer from './PoemExplorer';
import '@testing-library/jest-dom';

const randomPoemsMock = [
  { title: "Random Poem 1", author: "Random Poet 1", lines: ["Line 1", "Line 2"], linecount: 2 },
  { title: "Random Poem 2", author: "Random Poet 2", lines: ["Line 1", "Line 2", "Line 3"], linecount: 3 },
]

const currentUser = { username: 'testUser' };

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(randomPoemsMock),
  })
);

describe('PoemExplorer', () => {

  test('fetches random poems and renders them on mount', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <PoemExplorer />
        </UserContext.Provider>
      </Router>
    );

    // Check if loading indicator is shown
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the poems to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText(/Random Poem 1/)).toBeInTheDocument();
      expect(screen.getByText(/Random Poem 2/)).toBeInTheDocument();
      expect(screen.queryByText(/alert-danger/)).not.toBeInTheDocument();
    });

  });

  test('handles search input change and submission correctly', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <PoemExplorer />
        </UserContext.Provider>
      </Router>
    );
    
    // Make sure the initial loading state is resolved
    await waitFor(() => expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument());
    
    const input = screen.getByPlaceholderText(/i.e. The Raven/i);
    const button = screen.getByRole('button', { name: /search/i });
    
    // Mock setup for the specific search result before triggering the search
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ title: "The Raven", author: "Edgar Allan Poe", lines: ["Once upon a midnight dreary..."], linecount: 1 }])
      })
    );
  
    // Simulate user searching for poem title
    fireEvent.change(input, { target: { value: 'The Raven' } });
    fireEvent.click(button);
    
    // Await for the result.
    const ravenText = await screen.findByText(/The Raven/i);
    expect(ravenText).toBeInTheDocument();
  });
  
});