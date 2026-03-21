import { useContext } from 'react';
import { login, logout, getMe, register } from './services/auth.api';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async (username, email, password) => {
        setLoading(true);

        try {
            const response = await register(username, email, password);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (username, email, password) => {
        setLoading(true);

        try {
            const response = await login(username, email, password);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetMe = async () => {
        setLoading(true);

        try {
            const response = await getMe();
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            const response = await logout();
            setUser(null);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetMe();
    }, []);

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    };
};
