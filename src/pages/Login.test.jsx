    import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Page', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      login: vi.fn(),
      signup: vi.fn(),
      loginWithGoogle: vi.fn(),
    });
  });

  it('renders the login form correctly', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('toggles to sign up mode and shows SACCO owner fields', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Create an Account')).toBeInTheDocument();

    const ownerCheckbox = screen.getByLabelText(/Register as a SACCO Owner/i);
    fireEvent.click(ownerCheckbox);

    expect(screen.getByPlaceholderText('e.g., Super Metro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter secret code')).toBeInTheDocument();
  });

  it('calls the login function on submit', async () => {
    const mockLogin = vi.fn();
    
    useAuth.mockReturnValue({
      login: mockLogin,
      signup: vi.fn(),
      loginWithGoogle: vi.fn(),
    });

    render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@gmail.com', 'password123');
    });
  });
});