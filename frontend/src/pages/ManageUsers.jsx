import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users. You may not have permission.');
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete the user: ${userName}?`)) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user. You cannot delete your own account.');
            }
        }
    };

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 border-b">
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    {currentUser?.id !== user.id && (
                                        <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;