import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/login'; // Ensure this matches your FastAPI URL

const Authentication: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // Clear previous errors

        try {
            // Make the login request with axios
            const response = await axios.post(API_URL, 
                { email, password }, 
                { withCredentials: true } // Include credentials
            );

            const { access_token } = response.data;

            Cookies.set('token', access_token, { expires: 1 });
            
            // Redirect to home page after successful login
            navigate('/home'); // Redirect to home page
        } catch (err: any) {
            // Handle error response
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || 'An error occurred during login.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
};

export default Authentication;