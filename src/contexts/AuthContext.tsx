import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  balance: number;
  teraBalance: number;
  miningBalance: number;
  earningProfit: number;
  earningReferral: number;
  walletAddress: string;
  phoneNumber: string;
  isActive: boolean;
  miningActive: boolean;
  lastMiningStart?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@tonmining.com',
    username: 'Admin',
    role: 'admin',
    balance: 0,
    teraBalance: 0,
    miningBalance: 0,
    earningProfit: 0,
    earningReferral: 0,
    walletAddress: '',
    phoneNumber: '',
    isActive: true,
    miningActive: false,
  },
  {
    id: '2',
    email: 'user@example.com',
    username: 'DemoUser',
    role: 'user',
    balance: 100,
    teraBalance: 50,
    miningBalance: 100,
    earningProfit: 45.5,
    earningReferral: 12.3,
    walletAddress: 'EQD...abc123',
    phoneNumber: '+1234567890',
    isActive: true,
    miningActive: true,
    lastMiningStart: Date.now(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('ton_mining_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ton_mining_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      role: 'user',
      balance: 0,
      teraBalance: 0,
      miningBalance: 0,
      earningProfit: 0,
      earningReferral: 0,
      walletAddress: '',
      phoneNumber: '',
      isActive: true,
      miningActive: false,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('ton_mining_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ton_mining_user');
    navigate('/login');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('ton_mining_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
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
