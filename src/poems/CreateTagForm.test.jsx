import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateTagForm from './CreateTagForm';
import UserContext from '../common/UserContext';
import BackendApi from '../common/backendApi';

const currentUser = { username: 'testUser' };
const poemMock = {
  id: 'poem1',
  title: 'Poem 1',
  author: 'Author 1',
  lines: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
  linecount: 4
};
const selectedIndicesMock = [0, 1];

// Mocking react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual for all non-hook parts
  useParams: () => ({
    poemId: 'poem1',
  }),
  useNavigate: () => jest.fn(),
  // Simulate initial state passed from poem page
  useLocation: () => ({
    state: { data: { selectedIndices: selectedIndicesMock, poem: poemMock, currentUser: currentUser } }, 
  }),
  
}));

// Mock backendApi module
jest.mock('../common/backendApi');

describe('CreateTagForm', () => {
  beforeEach(() => {
    BackendApi.getThemes.mockResolvedValue([{name: 'Theme 1'}, {name: 'Theme 2'}]);
    BackendApi.addTheme.mockResolvedValue({ name: 'Theme 3' });
    BackendApi.addTag.mockResolvedValue({ theme_name: "Theme 1", poem_id: "poem1", highlighted_lines: [0,1], analysis: "Mock analysis", username: "testUser" });
  });

  test('renders CreateTagForm with poem details and theme selection', async () => {
    render(
      <Router>
        <UserContext.Provider value={{ currentUser }}>
          <CreateTagForm />
        </UserContext.Provider>
      </Router>
    );

    // Check if poem details and the currently existing theme choices are rendered
    await waitFor(() => {
      expect(screen.getByText(/Poem 1/)).toBeInTheDocument();
      expect(screen.getByText(/by Author 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 2/)).toBeInTheDocument();
      expect(screen.getByText(/Theme 1/)).toBeInTheDocument();
      expect(screen.getByText(/Theme 2/)).toBeInTheDocument();
  })});

});
