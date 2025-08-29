import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

const MockedLogin = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

describe('Login Component', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({
            login: mockLogin,
            currentUser: null,
        });
        mockLogin.mockClear();
    });

    test('renders login form with email & password fields', () => {
        render(<MockedLogin />);

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('updates input values when user types', async () => {
        render(<MockedLogin />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwdInput = screen.getByPlaceholderText('Password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
        fireEvent.change(passwdInput, { target: { value: 'password123' }});

        expect(emailInput.value).toBe('test@example.com');
        expect(passwdInput.value).toBe('password123');
    });

    test('calls login function on form submission', async () => {
        render(<MockedLogin />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwdInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
        fireEvent.change(passwdInput, { target: { value: 'password123' }});
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    test('displays error message when login fails', async () => {
        mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

        render(<MockedLogin />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwdInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
        fireEvent.change(passwdInput, { target: { value: 'wrongpassword' }});
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to log in: Invalid credentials/i)).toBeInTheDocument();
        });
    });
});