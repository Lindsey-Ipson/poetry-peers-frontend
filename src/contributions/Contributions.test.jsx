import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Contributions from './Contributions';
import UserContext from '../common/UserContext';
import BackendApi from '../common/backendApi';

// Mock BackendApi
jest.mock('../common/backendApi');

// Mock useNavigate and retain actual implementations for other parts of react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock window.scrollTo to avoid jsdom not implemented error
window.scrollTo = jest.fn();

describe('Contributions', () => {
  const currentUser = { username: 'testUser' };
  const tagsMock = [
    {
      themeName: 'Theme 1',
      poemId: 'poem1',
      highlightedLines: [1, 3],
      analysis: 'Sample analysis',
      poem: {
        title: 'Poem 1',
        author: 'Author 1',
        lines: ['Line 1', 'Line 2', 'Line 3'],
      },
    },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    BackendApi.getTagsByUsername.mockResolvedValue(tagsMock);
    BackendApi.getPoemById.mockResolvedValue(tagsMock[0].poem);
    BackendApi.deleteTag.mockResolvedValue({ message: 'Tag successfully deleted.' });
    // Reset mockNavigate to have a fresh mock function for each test
    mockNavigate.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders contributions', async () => {
    const { findByText } = render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <Contributions />
        </UserContext.Provider>
      </Router>
    );

    expect(await findByText(/Your Contributions/i)).toBeInTheDocument();
    expect(await findByText(/Sample analysis/i)).toBeInTheDocument();
    expect(BackendApi.getTagsByUsername).toHaveBeenCalledWith(currentUser.username);
  });

  test('handles tag deletion', async () => {
    const { getByText, queryByText } = render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <Contributions />
        </UserContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(getByText(/Delete tag/i)).toBeInTheDocument();
    });

    fireEvent.click(getByText(/Delete tag/i));

    await waitFor(() => {
      expect(BackendApi.deleteTag).toHaveBeenCalledWith(tagsMock[0].themeName, tagsMock[0].poemId, tagsMock[0].highlightedLines);
      expect(queryByText(/Sample analysis/i)).not.toBeInTheDocument();
    });
  });

});
