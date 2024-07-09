import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


interface SignInPageProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch('http://localhost:3000/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.auth && data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Token stored:', data.token); // Log the token for debugging
            setIsLoggedIn(true);
            navigate((location.state as { referrer?: string } | null)?.referrer || '/admin');
        } else {
            alert('Login failed: Invalid credentials or no token received');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + (error instanceof Error ? error.message : 'An error occurred'));
    }
    setLoading(false);
};

const fetchProtectedResource = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No token found, please sign in first.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch protected resource');
        }

        const data = await response.json();
        console.log('Protected resource data:', data);
    } catch (error) {
        console.error('Error fetching protected resource:', error);
    }
};


  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-200 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-3 block w-full rounded-lg border border-gray-400 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 block w-full rounded-lg border border-gray-400 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;