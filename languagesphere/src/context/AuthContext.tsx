import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  payments: {
    course: { paid: boolean; paymentDate?: string; paymentId?: string };
    book: { paid: boolean; paymentDate?: string; paymentId?: string };
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  checkPaymentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error: any) {
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        let errorDetails = null;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
          errorDetails = errorData.error || errorData.errors;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        // Provide more helpful error messages
        if (errorMessage.includes('already exists')) {
          throw new Error('An account with this email already exists. Please login instead.');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error: any) {
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      }
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const checkPaymentStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/payment/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (user) {
          setUser({ ...user, payments: data.payments });
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, checkPaymentStatus }}>
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

