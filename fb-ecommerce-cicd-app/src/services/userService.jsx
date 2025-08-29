import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase/config';

export const getUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
};

export const updateUserProfile = async (uid, userData) => {
    await updateDoc(doc(db, 'users', uid), userData);
};

export const deleteUserAccount = async (uid) => {
    // Delete user orders
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', uid));
    const orderDocs = await getDocs(ordersQuery);

    const deletePromises = orderDocs.docs.map(orderDoc => deleteDoc(doc(db, 'orders', orderDoc.id)));

    // Delete user documents
    deletePromises.push(deleteDoc(doc(db, 'users', uid)));

    await Promise.all(deletePromises);

    if (auth.currentUser) {
        await deleteUser(auth.currentUser)
    }
};