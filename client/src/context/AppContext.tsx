import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { checkAuthStatus } from '@/services/authService';

// Shape of the global app state you want to share
interface AppContextValue {
    user: { id: string; name: string; email: string; isAdmin?: boolean } | null;
    setUser: (u: AppContextValue['user']) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (v: boolean) => void;
    isAdmin: boolean;
    setIsAdmin: (v: boolean) => void;
    loading: boolean;
    setLoading: (v: boolean) => void;
    backendUrl: string;
}

// Create the context (undefined initial so we can warn if hook used outside provider)
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface ProviderProps { children: ReactNode }

export const AppContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<AppContextValue['user']>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading true for initial auth check
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000/api';

    // Check authentication status on component mount
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const authResult = await checkAuthStatus();
                
                if (authResult.isAuthenticated && authResult.user) {
                    setUser({
                        id: authResult.user.id,
                        name: authResult.user.name,
                        email: authResult.user.email,
                        isAdmin: authResult.user.isAdmin
                    });
                    setIsLoggedIn(true);
                    setIsAdmin(authResult.isAdmin);
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const value: AppContextValue = { 
        user, 
        setUser, 
        isLoggedIn, 
        setIsLoggedIn, 
        isAdmin,
        setIsAdmin,
        loading, 
        setLoading, 
        backendUrl 
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Convenience hook
export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
    return ctx;
};

export default AppContext;
