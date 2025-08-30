import { createContext, useContext, useState, ReactNode } from 'react';

// Shape of the global app state you want to share
interface AppContextValue {
    user: { id: string; name: string; email: string } | null;
    setUser: (u: AppContextValue['user']) => void;
    loading: boolean;
    setLoading: (v: boolean) => void;
    backendUrl: string;
}

// Create the context (undefined initial so we can warn if hook used outside provider)
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface ProviderProps { children: ReactNode }

export const AppContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<AppContextValue['user']>(null);
    const [loading, setLoading] = useState(false);
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000/api';

    const value: AppContextValue = { user, setUser, loading, setLoading, backendUrl };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Convenience hook
export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
    return ctx;
};

export default AppContext;
