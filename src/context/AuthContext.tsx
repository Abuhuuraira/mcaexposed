import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth_token');
    const storedUsername = localStorage.getItem('auth_username');
    if (storedAuth && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (inputUsername: string, password: string): boolean => {
    // Simple authentication - you can replace this with API calls later
    // For demo: username "admin" and password "admin123" 
    if (inputUsername === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUsername(inputUsername);
      localStorage.setItem('auth_token', 'authenticated');
      localStorage.setItem('auth_username', inputUsername);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
