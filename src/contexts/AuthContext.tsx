import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@admin.com',
    name: 'Super Admin',
    role: 'super_admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  },
  {
    id: '2',
    email: 'city.admin@admin.com',
    name: 'Mumbai Admin',
    role: 'admin',
    city: 'Mumbai',
    status: 'active',
    createdAt: '2024-01-02',
    lastLogin: '2024-01-15'
  },
  {
    id: '3',
    email: 'support@admin.com',
    name: 'Support Tech',
    role: 'support_tech',
    status: 'active',
    createdAt: '2024-01-03',
    lastLogin: '2024-01-14'
  },
  {
    id: '4',
    email: 'sales@admin.com',
    name: 'Sales Manager',
    role: 'sales_marketing',
    city: 'Delhi',
    status: 'active',
    createdAt: '2024-01-04',
    lastLogin: '2024-01-13'
  },
  {
    id: '5',
    email: 'accounting@admin.com',
    name: 'Accounting Manager',
    role: 'accounting',
    city: 'Mumbai',
    status: 'active',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-12'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - check if user exists and password is correct
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && password === 'admin123') {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasRole,
      isLoading
    }}>
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