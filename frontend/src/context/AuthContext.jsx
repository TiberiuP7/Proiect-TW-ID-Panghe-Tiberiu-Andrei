import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:3000';

    useEffect(() => {
        const verifyUserToken = async () => {
            if (token) {
                try {
                    // Endpointul tău din auth.routes.js
                    const res = await axios.post(`${API_URL}/auth/check`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        setIsAuthenticated(true);
                        setUser(res.data.data); // Datele decodate din token (id, role)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    } else {
                        logout();
                    }
                } catch (err) {
                    logout();
                }
            }
            setLoading(false);
        };
        verifyUserToken();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout, API_URL }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};