import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from '../Cart';
import { useAuth } from '../../hooks/useAuth';
import * as orderService from '../../services/orderService';

jest.mock('../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));
jest.mock('../../services/orderService');

// Mock window.alert
Object.defineProperty(window, 'alert', {
    writable: true,
    value: jest.fn(),
});

describe('Cart Integration Tests', () => {
    const mockCartItems = [
        {
            id:'1',
            title: 'Product 1',
            price: 10.99,
            quantity: 2
        },
        {
            id: '2',
            title: 'Product 2',
            price: 25.50,
            quantity: 1
        }
    ];

    const mockClearCart = jest.fn();
    const mockCurrentUser = { uid: 'user123', email: 'test@example.com' };

    beforeEach(() => {
        useAuth.mockReturnValue({
            currentUser: mockCurrentUser,
        });
        orderService.createOrder.mockResolvedValue('order123');
        jest.clearAllMocks();
    });

    // test: displays cart items with correct calculations
    test('displays cart items with correct calculations', () => {
        render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        // Check if cart items are displayed
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Price: $25.5')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();

        // Check subtotals
        expect(screen.getByText('Subtotal: $21.98')).toBeInTheDocument();
        expect(screen.getByText('Subtotal: $25.50')).toBeInTheDocument();

        // Check total
        expect(screen.getByText('Total: $47.48')).toBeInTheDocument();
    });

    test('updates total when cart items change', () => {
        const { rerender } = render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        // Initial total
        expect(screen.getByText('Total: $47.48')).toBeInTheDocument();

        // Add item to cart
        const updatedCartItems = [
            ...mockCartItems,
            {
                id: '3', title: 'Product 3',
                price: 15.00, quantity: 1
            }
        ];

        rerender(<Cart cartItems={updatedCartItems} clearCart={mockClearCart} />);

        // Check updated total
        expect(screen.getByText('Total: $62.48')).toBeInTheDocument();
    });

    test('successfully places order and clears cart', async () => {
        render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        // Click place order function
        fireEvent.click(screen.getByText('Place Order'));

        await waitFor(() => {
            // Ckeck if createOrder was called with correct parameters
            expect(orderService.createOrder).toHaveBeenCalledWith(
                mockCurrentUser.uid, mockCartItems
            );

            // Check if success alert was shown
            expect(window.alert).toHaveBeenCalledWith('Order placed successfully! Order ID: order123');

            // Check if cart was cleared
            expect(mockClearCart).toHaveBeenCalled();
        });
    });

    test('shows login prompt when user is not authenticated', async () => {
        useAuth.mockReturnValue({
            currentUser: null,
        });

        render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        // Click place order button
        fireEvent.click(screen.getByText('Place Order'));

        await waitFor(() => {
            // Check if login prompt was shown
            expect(window.alert).toHaveBeenCalledWith('Please log in to place and order');

            // Check that createOrder was not called
            expect(orderService.createOrder).not.toHaveBeenCalled();

            // Check that cart was not cleared
            expect(mockClearCart).not.toHaveBeenCalled();
        });
    });

    test('handles order creation failure', async () => {
        orderService.createOrder.mockRejectedValue(new Error('Order creation failed'));

        render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        // Click place order button
        fireEvent.click(screen.getByText('Place Order'));

        await waitFor(() => {
            // Check if error alert was shown
            expect(window.alert).toHaveBeenCalledWith('Failed to place order');

            //Check that cart was not cleared
            expect(mockClearCart).not.toHaveBeenCalled();
        });
    })

    test('renders empty cart message when no items', ()  => {
        render(<Cart cartItems={mockCartItems} clearCart={mockClearCart} />);

        expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
        expect(screen.getByText('Place Order')).toBeInTheDocument();
    });
});