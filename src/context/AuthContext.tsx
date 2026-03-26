import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USERNAME_KEY = 'auth_username';
const AUTH_EXPIRES_KEY = 'auth_expires_at';
const AUTH_ATTEMPTS_KEY = 'auth_attempt_count';
const AUTH_LOCK_UNTIL_KEY = 'auth_lock_until';

const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME ?? '').trim();
const PASSWORD_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
const PASSWORD_SALT_PREFIX = import.meta.env.VITE_AUTH_SALT_PREFIX ?? 'mca-expose::';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');

const hashPassword = async (password: string): Promise<string> => {
  const payload = new TextEncoder().encode(`${PASSWORD_SALT_PREFIX}${password}`);
  const digest = await crypto.subtle.digest('SHA-256', payload);
  return toHex(digest);
};

const timingSafeEqual = (valueA: string, valueB: string): boolean => {
  if (valueA.length !== valueB.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < valueA.length; index += 1) {
    mismatch |= valueA.charCodeAt(index) ^ valueB.charCodeAt(index);
  }
  return mismatch === 0;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUsername = localStorage.getItem(AUTH_USERNAME_KEY);
    const storedExpiresAt = Number(localStorage.getItem(AUTH_EXPIRES_KEY) ?? '0');
    const hasActiveSession = Boolean(storedAuth) && Boolean(storedUsername) && Date.now() < storedExpiresAt;

    if (hasActiveSession) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
    localStorage.removeItem(AUTH_EXPIRES_KEY);
  }, []);

  const login = async (inputUsername: string, password: string): Promise<boolean> => {
    if (!ADMIN_USERNAME || !PASSWORD_HASH) {
      return false;
    }

    const lockUntil = Number(localStorage.getItem(AUTH_LOCK_UNTIL_KEY) ?? '0');
    if (Date.now() < lockUntil) {
      return false;
    }

    if (inputUsername !== ADMIN_USERNAME) {
      return false;
    }

    const computedHash = await hashPassword(password);
    const validPassword = timingSafeEqual(computedHash, PASSWORD_HASH);

    if (!validPassword) {
      const attemptCount = Number(localStorage.getItem(AUTH_ATTEMPTS_KEY) ?? '0') + 1;
      localStorage.setItem(AUTH_ATTEMPTS_KEY, String(attemptCount));

      if (attemptCount >= MAX_FAILED_ATTEMPTS) {
        localStorage.setItem(AUTH_LOCK_UNTIL_KEY, String(Date.now() + LOCKOUT_MS));
        localStorage.setItem(AUTH_ATTEMPTS_KEY, '0');
      }
      return false;
    }

    localStorage.setItem(AUTH_ATTEMPTS_KEY, '0');
    localStorage.removeItem(AUTH_LOCK_UNTIL_KEY);

    setIsAuthenticated(true);
    setUsername(inputUsername);
    localStorage.setItem(AUTH_TOKEN_KEY, crypto.randomUUID());
    localStorage.setItem(AUTH_USERNAME_KEY, inputUsername);
    localStorage.setItem(AUTH_EXPIRES_KEY, String(Date.now() + SESSION_TTL_MS));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
    localStorage.removeItem(AUTH_EXPIRES_KEY);
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
