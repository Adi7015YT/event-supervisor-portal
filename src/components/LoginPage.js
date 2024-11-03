import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://genai-supervisor-ticketing-system.onrender.com/v1/user/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                navigate('/dashboard');
            } else {
                setError(data.detail || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Dashboard</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Username
                        </label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required 
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            required 
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
                            ${loading 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                            }
                        `}
                        disabled={loading}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {loading && <LoadingSpinner />}
                            <span>{loading ? 'Logging in...' : 'Login'}</span>
                        </div>
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Having trouble logging in? Contact your administrator
                </div>
            </div>
        </div>
    );
};

export default LoginPage;