import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserOrders, getOrderById } from '../services/orderService';

const OrderHistory = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (currentUser) {
                try {
                    const userOrders = await getUserOrders(currentUser.uid);
                    setOrders(userOrders);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            }
            setLoading(false);
        };
        fetchOrders();
    }, [currentUser]);

    const handleViewOrder = async (orderId) => {
        try {
            const order = await getOrderById(orderId);
            setSelectedOrder(order);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-history">
            <h2>Order History</h2>
      
            {!selectedOrder ? (
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="order-item">
                                <h3>Order #{order.id}</h3>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                                <p>Status: {order.status}</p>
                                <button onClick={() => handleViewOrder(order.id)}>View Details</button>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="order-details">
                    <h3>Order Details - #{selectedOrder.id}</h3>
                    <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <h4>Items:</h4>
                    {selectedOrder.items.map((item, index) => (
                        <div key={index} className="order-item-detail">
                            <p>{item.title} - Quantity: {item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <h4>Total: ${selectedOrder.totalPrice.toFixed(2)}</h4>
                    <button onClick={() => setSelectedOrder(null)}>Back to Orders</button>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;