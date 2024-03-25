import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnalyzePoem from './AnalyzePoem';
import UserContext from '../common/UserContext';
import BackendApi from '../common/backendApi';

// Mock BackendApi
jest.mock('../common/backendApi');

// Mocking react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    poemId: 'poem1',
  }),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: null, // Simulate no initial state passed
  }),
}));

describe('AnalyzePoem', () => {
  const currentUser = { username: 'testUser' };
  const poemMock = {
    id: 'poem1',
    title: 'Poem 1',
    author: 'Author 1',
    lines: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
  };
  const tagsMock = [
    {
      themeName: 'Theme 1',
      poemId: 'poem1',
      highlightedLines: [0, 1],
      analysis: 'Sample analysis 1',
      username: 'user1',
      datetime: '2021-01-01',
    },
    {
      themeName: 'Theme 2',
      poemId: 'poem1',
      highlightedLines: [1, 2, 3],
      analysis: 'Sample analysis 2',
      username: 'user2',
      datetime: '2022-02-02',
    }
  ];

  beforeEach(() => {
    BackendApi.getPoemById.mockResolvedValue(poemMock);
    BackendApi.getTagsByPoemId.mockResolvedValue(tagsMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AnalyzePoem', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <AnalyzePoem />
        </UserContext.Provider>
      </Router>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Poem 1')).toBeInTheDocument();
      expect(screen.getByText('by Author 1')).toBeInTheDocument();
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      const theme1s = screen.getAllByText('Theme 1');
      expect(theme1s.length).toBe(2);
      const theme2s = screen.getAllByText('Theme 2');
      expect(theme2s.length).toBe(3);
    });
  });

});