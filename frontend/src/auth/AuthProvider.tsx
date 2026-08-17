import React, { createContext, useContext, useEffect, useState } from 'react';
import { refreshClient } from '../lib/api/refreshClient';
import { setAccessToken, clearAccessToken } from './tokenStore';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthState;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthState>('loading');

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      try {
        const { data } = await refreshClient.post('/auth/refresh');
        if (mounted) {
          setAccessToken(data.accessToken);
          setStatus('authenticated');
        }
      } catch (err) {
        if (mounted) {
          clearAccessToken();
          setStatus('unauthenticated');
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (token: string) => {
    setAccessToken(token);
    setStatus('authenticated');
  };

  const logout = () => {
    clearAccessToken();
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
