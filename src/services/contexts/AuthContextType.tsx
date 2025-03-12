import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { fetchGET } from '../api';


interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isLogged = !!user;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await fetchGET('/users/me');
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('User is not logged in:', error);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
};
