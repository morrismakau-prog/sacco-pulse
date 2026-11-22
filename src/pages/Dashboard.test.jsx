import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';

window.alert = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { saccoName: 'Super Metro', role: 'sacco_owner' } }),
}));

const mockUpdateDoc = vi.fn();
vi.mock('../firebase/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ 
    docs: [
      { id: '1', data: () => ({ saccoName: 'Super Metro', reviewText: 'Great ride', rating: 5, locationName: 'CBD' }) }
    ] 
  })),
  updateDoc: (...args) => mockUpdateDoc(...args),
  doc: vi.fn(),
}));

describe('Dashboard Page', () => {
  it('renders reviews and allows owner to submit a reply', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText('"Great ride"')).toBeInTheDocument();

    const replyInput = screen.getByPlaceholderText('Write a public reply...');
    fireEvent.change(replyInput, { target: { value: 'Thank you for the feedback!' } });

    const replyBtn = screen.getByRole('button', { name: /Reply/i });
    fireEvent.click(replyBtn);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });
});