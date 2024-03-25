import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BackendApi from '../common/backendApi';
import UserContext from '../common/UserContext';
import ViewTheme from './ViewTheme';

jest.mock('../common/backendApi');

// Mocking react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    themeName: 'Theme 1',
  }),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: null, // Simulate no initial state passed
  }),
}));

const currentUser = { username: 'testUser' };

const themeTagsMock = [{ poemId: '1', themeName: 'Theme 1', highlightedLines: [0], analysis: 'Mock analysis 1', username: 'testUser', datetime: '2024-03-24T12:00:00Z' }, { poemId: '1', themeName: 'Theme 1', highlightedLines: [1,2], analysis: 'Mock analysis 2', username: 'testUser', datetime: '2024-03-24T12:00:00Z' }];
const poemMock = {
  id: '1',
  title: 'Poem 1',
  author: 'Author 1',
  lines: ['Line 1', 'Line 2', 'Line 3'],
  linecount: 3
}
const poemTagsMock = [{ themeName: 'Theme 1', highlightedLines: [0], analysis: 'Mock analysis 1', username: 'testUser', datetime: '2024-03-24T12:00:00Z' }, { themeName: 'Theme 1', highlightedLines: [1,2], analysis: 'Mock analysis 2', username: 'testUser', datetime: '2024-03-24T12:00:00Z' }];

describe('ViewTheme', () => {
  beforeEach(() => {
    BackendApi.getTagsByThemeName.mockResolvedValue(themeTagsMock);
    BackendApi.getPoemById.mockResolvedValue(poemMock);
    BackendApi.getTagsByPoemId.mockResolvedValue(poemTagsMock);
  });

  test('renders with relevant poems and tags', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <ViewTheme />
        </UserContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Theme 1')).toBeInTheDocument();
      expect(screen.getByText(/Poem 1/)).toBeInTheDocument();
      expect(screen.getByText(/Author 1/)).toBeInTheDocument();
      expect(screen.getByText(/Mock analysis 1/)).toBeInTheDocument();
      expect(screen.getByText(/Mock analysis 2/)).toBeInTheDocument();
    });
  });

});

