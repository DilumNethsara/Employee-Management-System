import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    isLoading: false
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (token) {
            api.get('/user').then(res => setUser(res.data)).catch(() => {
                setToken(null);
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    }, [token]);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            const { access_token, user } = response.data;
            setToken(access_token);
            setUser(user);
            localStorage.setItem('token', access_token);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name, email, password, role) => {
        setIsLoading(true);
        try {
            const response = await api.post('/register', { name, email, password, role });
            const { access_token, user } = response.data;
            setToken(access_token);
            setUser(user);
            localStorage.setItem('token', access_token); // Login immediately? Or redirect to login? Prompt says Login returns token. Register usually does too.
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) { console.error(e); }
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
