import { TextEncoder } from "util";
import '@testing-library/jest-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthContext from './hooks/AuthContext';

// Globally assigning TextEncoder
globalThis.TextEncoder = TextEncoder;

// Mock Firebase modules
jest.mock('./firebase/config', () => ({
    auth: {
        currentUser: null,
    },
    db: {},
}));

// Mock React Router
jest.mock('./contexts/AuthContext', () => ({
    AuthProvider: ({ children }) => children,
    AuthContext: {
        Provider: ({ children }) => children,
    },
}));

// Mock useAuth hook
jest.mock('./hooks/useAuth', () => ({
    useAuth: () => ({
        currentUser: null,
        login: jest.fn(),
        logout: jest.fn(),
        signup: jest.fn(),
    }),
}));
