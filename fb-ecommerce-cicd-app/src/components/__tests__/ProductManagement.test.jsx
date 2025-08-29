import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductManagement from '../ProductManagement';
import * as productService from '../../services/productService';

// Mock the product services
jest.mock('../../services/productService', () => ({
    getAllProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
    writable: true,
    value: jest.fn(),
});

describe('ProductManagement Component', () => {
    const mockProducts = [
        {
            id: '1',
            title: 'Test product',
            price: '29.99',
            description: 'Test Description',
            category: 'Electronics',
            image: 'http://example.com/image.jpg'
        }
    ];

    beforeEach(() => {
        productService.getAllProducts.mockResolvedValue(mockProducts);
        productService.createProduct.mockResolvedValue('new-id');
        productService.updateProduct.mockResolvedValue();
        productService.deleteProduct.mockResolvedValue();
        jest.clearAllMocks();
    });

    test('renders product management form & product title', async () => {
        render(<ProductManagement />);

        // check if form elements are present
        expect(screen.getByPlaceholderText('Product-Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Category')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Image URL')).toBeInTheDocument();

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Test product')).toBeInTheDocument();
        });
    });

    test('create new product when form is submitted', async () => {
        render(<ProductManagement />);

        // Fill out form
        fireEvent.change(screen.getByPlaceholderText('Product-Title'), {
            target: { value: 'New Product' }
        });
        fireEvent.change(screen.getByPlaceholderText('Price'), {
            target: { value: '39.99' }
        });
        fireEvent.change(screen.getByPlaceholderText('Description'), {
            target: { value: 'New Description' }
        });
        fireEvent.change(screen.getByPlaceholderText('Category'), {
            target: { value: 'Books' }
        });
        fireEvent.change(screen.getByPlaceholderText('Image URL'), {
            target: { value: 'http://example.com/new-image.jpg' }
        });

        // Submit the form
        fireEvent.click(screen.getByText('Create Product'));

        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalledWith({
                title: 'New Product',
                price: '39.99',
                description: 'New Description',
                category: 'Books',
                image: 'http://example.com/new-image.jpg'
            });
        });
    });

    test('switches to edit mode when edit button is clicked', async () => {
        render(<ProductManagement />);

        await waitFor(() => {
            expect(screen.getByText('Test product')).toBeInTheDocument();
        });

        // Click the edit button
        fireEvent.click(screen.getByText('Edit'));

        // Check if form is populated with product data
        expect(screen.getByDisplayValue('Test product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('29.99')).toBeInTheDocument();
        expect(screen.getByText('Update Product')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('deletes product when delete button is clicked and confirmed', async () => {
        window.confirm.mockReturnValue(true);
        render(<ProductManagement />);

        await waitFor(() => {
            expect(screen.getByText('Test product')).toBeInTheDocument();
        });

        // Click delete button
        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(productService.deleteProduct).toHaveBeenCalledWith('1');
        });
    });

    test('does not delete product when delete is cancelled', async () => {
        window.confirm.mockReturnValue(false);
        render(<ProductManagement />);

        await waitFor(() => {
            expect(screen.getByText('Test product')).toBeInTheDocument();
        });

        // click delete button
        fireEvent.click(screen.getByText('Delete'));

        expect(productService.deleteProduct).not.toHaveBeenCalled();
    });
});