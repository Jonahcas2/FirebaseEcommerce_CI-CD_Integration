import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserData, updateUserProfile, deleteUserAccount } from '../services/userService';

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const [userData, setUserData] = useState({
        name: '', email: '', address: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const data = await getUserData(currentUser.uid);
                if (data) {
                    setUserData(data);
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(currentUser.uid, {
                name: userData.name, address: userData.address
            });
            setIsEditing(false)
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await deleteUserAccount(currentUser.uid);
                await logout();
            } catch (error) {
                alert('Error deleting account: ' + error.message);
            }
        }
    };

    return (
        <div className='user-profile'>
            <h2>User Profile</h2>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <input type='text' value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    placeholder='Name' />

                    <input type='email' value={userData.email} 
                    readOnly placeholder='Email' />

                    <input type='text' value={userData.address}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                    placeholder='Address' />
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button onClick={handleDeleteAccount} className="danger-btn">Delete Account</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;