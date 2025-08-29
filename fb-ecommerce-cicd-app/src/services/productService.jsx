import { collection, getDocs, doc, getDoc, addDoc, updateDoc,deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// getAllProducts
export const getAllProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
    }));
};

// getProductsById
export const getProductsById = async (id) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// createProduct
export const createProduct = async (productData) => {
    const docRef = await addDoc(collection(db, 'products'), {
        ...productData, createdAt: new Date().toISOString()
    });
    return docRef.id;
};

//updateProduct
export const updateProduct = async (id, productData) => {
    await updateDoc(doc(db, 'products', id), {
        ...productData, updatedAt: new Date().toISOString()
    });
};

// deleteProduct
export const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
};