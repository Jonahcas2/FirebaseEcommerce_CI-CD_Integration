import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/orderService';

const Cart = ({ cartItems, clearCart }) => {
    const { currentUser } = useAuth();

    const handleCheckout = async () => {
        if (!currentUser) {
            alert('Please log in to place and order');
            return;
        }

        try {
            const orderId = await createOrder(currentUser.uid, cartItems);
            alert(`Order placed successfully! Order ID: ${orderId}`);
            clearCart();
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to place order');
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className='cart'>
            <h2>Shopping Cart</h2>
            {cartItems.map(item => (
                <div key={item.id} className='cart-item'>
                    <h4>{item.title}</h4>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
            <div className='cart-total'>
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button onClick={handleCheckout}>Place Order</button>
            </div>
        </div>
    );
};

export default Cart;