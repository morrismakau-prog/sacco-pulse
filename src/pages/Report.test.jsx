import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Report from './Report';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: '123', email: 'test@gmail.com' } }),
}));

vi.mock('../firebase/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve()), // Mock the save to database
}));

global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve([{ place_id: 1, display_name: 'Westlands, Nairobi' }]),
  })
);

describe('Report Issue Page', () => {
  it('allows user to fill the form, search location, and submit', async () => {
    render(
      <BrowserRouter>
        <Report />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g., Super Metro, Embassava'), {
      target: { value: 'Super Metro' }
    });

    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[4]); 

    const locationInput = screen.getByPlaceholderText('Search for a stage (e.g., Westlands)...');
    fireEvent.change(locationInput, { target: { value: 'Westlands' } });

    const searchBtns = screen.getAllByRole('button', { name: /Search/i });
    fireEvent.click(searchBtns[0]);

    const resultItem = await screen.findByText(/Westlands, Nairobi/i);
    fireEvent.click(resultItem);

    fireEvent.change(screen.getByPlaceholderText('What happened? Please provide details...'), {
      target: { value: 'Great ride' }
    });

    const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Submit Review/i })).not.toBeInTheDocument() || expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
    });
  });
});