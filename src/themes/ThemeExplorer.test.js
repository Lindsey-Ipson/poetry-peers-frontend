import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeExplorer from './ThemeExplorer';
import BackendApi from '../common/backendApi';
import UserContext from '../common/UserContext';

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

const currentUser = { username: 'testUser' };

const themesMock = [{name: 'Theme 1'}, {name: 'Theme 2'}]
const poemMock1 = {
  id: 'poem1',
  title: 'Poem 1',
  author: 'Author 1',
  lines: ['Line 1', 'Line 2', 'Line 3', 'Line 4']
};
const poemMock2 = {
  id: 'poem2',
  title: 'Poem 2',
  author: 'Author 2',
  lines: ['Line A', 'Line B', 'Line C', 'Line D']
};
const tagsByThemeNameMock = [ { themeName: 'Theme 1', poemId: 'poem1', highlightedLines: [1,2], analysis: 'Mock analysis', username: 'testUser' }];

describe('ThemeExplorer', () => {
  beforeEach(() => {
    BackendApi.getThemes.mockResolvedValue(themesMock);
    BackendApi.getTagsByThemeName.mockResolvedValue(tagsByThemeNameMock);
    BackendApi.getPoemById.mockResolvedValueOnce(poemMock1).mockResolvedValue(poemMock2);
  });

  test('renders ThemeExplorer with themes and poems', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <ThemeExplorer />
        </UserContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Themes')).toBeInTheDocument();
      const theme1s = screen.getAllByText('Theme 1');
      expect(theme1s.length).toBe(1);
      const theme2s = screen.getAllByText('Theme 2');
      expect(theme2s.length).toBe(1);
      const poem1s = screen.getAllByText(/Poem 1/);
      expect(poem1s.length).toBe(1);
      const poem2s = screen.getAllByText(/Poem 2/);
      expect(poem2s.length).toBe(2);
    });
  });

});
