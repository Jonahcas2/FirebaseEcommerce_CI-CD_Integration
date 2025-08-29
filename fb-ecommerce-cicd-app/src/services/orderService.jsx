import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const createOrder = async (userId, cartItems) => {
    const orderData = {
        userId, items: cartItems, 
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdAt: new Date().toISOString(), status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
};

export const getUserOrders = async (userId) => {
    const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
    }));
};

export const getOrderById = async (orderId) => {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};