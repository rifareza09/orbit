import { useState, useEffect } from 'react';
import { AppwriteAuthService } from '@/services/appwrite-auth';
import type { Models } from 'appwrite';

/**
 * React Hook untuk Appwrite Authentication
 * Contoh penggunaan:
 * 
 * const { user, loading, login, logout, register } = useAppwriteAuth();
 */

export function useAppwriteAuth() {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    // Check jika user sudah login saat mount
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        setLoading(true);
        const result = await AppwriteAuthService.getCurrentUser();
        if (result.success && result.user) {
            setUser(result.user);
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        const result = await AppwriteAuthService.login(email, password);
        if (result.success) {
            await checkUser();
        }
        return result;
    };

    const register = async (email: string, password: string, name: string) => {
        const result = await AppwriteAuthService.register(email, password, name);
        if (result.success) {
            await checkUser();
        }
        return result;
    };

    const logout = async () => {
        const result = await AppwriteAuthService.logout();
        if (result.success) {
            setUser(null);
        }
        return result;
    };

    const updateName = async (name: string) => {
        const result = await AppwriteAuthService.updateName(name);
        if (result.success) {
            await checkUser();
        }
        return result;
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateName,
        refresh: checkUser,
    };
}
