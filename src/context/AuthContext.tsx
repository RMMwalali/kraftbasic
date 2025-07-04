import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: 'customer' | 'designer' }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
} | null>(null);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: new Date('2024-01-15'),
    isVerified: true,
    profile: {
      bio: 'Love custom designs and unique products!',
      location: 'New York, USA',
    },
    stats: {
      totalOrders: 12,
      totalSpent: 450.99,
    }
  },
  {
    id: '2',
    name: 'Sarah Designer',
    email: 'designer@example.com',
    role: 'designer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: new Date('2023-08-20'),
    isVerified: true,
    profile: {
      bio: 'Digital artist specializing in minimalist designs and nature themes.',
      location: 'San Francisco, USA',
      website: 'https://sarahdesigns.com',
      socialLinks: {
        instagram: '@sarahdesigns',
        behance: 'sarahdesigns',
      }
    },
    stats: {
      totalDesigns: 45,
      totalSales: 1234,
      totalEarnings: 15678.50,
      followers: 2456,
      rating: 4.8,
    }
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: new Date('2023-01-01'),
    isVerified: true,
    profile: {
      bio: 'Platform administrator',
      location: 'Remote',
    },
    stats: {
      totalOrders: 0,
      totalSpent: 0,
    }
  }
];

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      };
    case 'AUTH_ERROR':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('printcraft_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          // Validate user object
          if (user && user.id && user.email && user.role) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            localStorage.removeItem('printcraft_user');
            dispatch({ type: 'AUTH_ERROR', payload: 'Invalid session data' });
          }
        } else {
          dispatch({ type: 'AUTH_ERROR', payload: 'No session found' });
        }
      } catch (error) {
        localStorage.removeItem('printcraft_user');
        dispatch({ type: 'AUTH_ERROR', payload: 'Session corrupted' });
      }
    };

    // Simulate loading delay for better UX
    const timer = setTimeout(checkAuth, 800);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In real app, verify password here
      if (password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      localStorage.setItem('printcraft_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: 'customer' | 'designer' }) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200`,
        createdAt: new Date(),
        isVerified: false,
        profile: {
          bio: '',
          location: '',
        },
        stats: userData.role === 'customer' ? {
          totalOrders: 0,
          totalSpent: 0,
        } : {
          totalDesigns: 0,
          totalSales: 0,
          totalEarnings: 0,
          followers: 0,
          rating: 0,
        }
      };
      
      // Add to mock users array
      mockUsers.push(newUser);
      localStorage.setItem('printcraft_user', JSON.stringify(newUser));
      dispatch({ type: 'AUTH_SUCCESS', payload: newUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('printcraft_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('printcraft_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ 
      state, 
      dispatch, 
      login, 
      register, 
      logout, 
      updateProfile, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}