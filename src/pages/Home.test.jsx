import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { email: 'test@gmail.com' } }),
}));

vi.mock('../firebase/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ 
    docs: [
      { id: '1', data: () => ({ saccoName: 'Super Metro', reviewText: 'Good bus', rating: 4, locationName: 'CBD' }) }
    ] 
  })),
}));

describe('Home Page', () => {
  it('renders the search bar and displays fetched reviews', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to SaccoPulse')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for a Stage/i)).toBeInTheDocument();
    
    expect(await screen.findByText('"Good bus"')).toBeInTheDocument();
  });
});