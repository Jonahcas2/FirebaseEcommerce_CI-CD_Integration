import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        title: '', price: '', description: '',
        category: '', image: '' 
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsData = await getAllProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProduct(currentProduct.id, currentProduct);
            } else {
                await createProduct(currentProduct);
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const resetForm = () => {
        setCurrentProduct({
            title: '', price: '',
            description: '',
            category: '', image: ''
        });
        setIsEditing(false);
    };

    return (
        <div className='product-management'>
            <h2>Product Management</h2>

            <form onSubmit={handleSubmit} className='product-form'>
                // Title
                <input type='text' placeholder='Product-Title'
                value={currentProduct.title}
                onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})}
                required />

                // Price
                <input type='number' placeholder='Price'
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                required />

                // description
                <textarea placeholder='Description' value={currentProduct.description}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                required />

                // Category
                <input type='text' placeholder='Category' value={currentProduct.category}
                onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                required />

                // Image URL
                <input type='url' placeholder='Image URL' value={currentProduct.image}
                onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                required />
                <button type='submit'>{isEditing ? 'Update' : 'Create'} Product</button>
                {isEditing && <button type='button' onClick={resetForm}>Cancel</button>}
            </form>

            <div className='product-list'>
                {products.map(product => (
                    <div key={product.id} className='product-item'>
                        <h3>{product.title}</h3>
                        <p>Price: ${product.price}</p>
                        <p>{product.description}</p>
                        <p>Category: {product.category}</p>
                        <button onClick={() => handleEdit(product)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;