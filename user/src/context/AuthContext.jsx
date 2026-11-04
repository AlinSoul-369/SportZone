import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'sportzone_user';

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function getStoredUser() {
  const raw =
    localStorage.getItem(USER_STORAGE_KEY) ||
    sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function persistUser(userData, remember = false) {
    const safeUser = stripPassword(userData);
    const storage = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    other.removeItem(USER_STORAGE_KEY);
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }

  async function refreshUser() {
    const storedUser = getStoredUser();
    if (!storedUser?._id) return null;

    const remember = !!localStorage.getItem(USER_STORAGE_KEY);
    setLoading(true);
    try {
      const { data } = await API.get(`/users/${storedUser._id}`);
      return persistUser(data.user, remember);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password, remember = false) {
    setLoading(true);
    try {
      const { data } = await API.post('/login', { email, password });
      return persistUser(data.user, remember);
    } finally {
      setLoading(false);
    }
  }

  async function register({ fullname, email, password, phone }) {
    setLoading(true);
    try {
      const { data } = await API.post('/register', {
        fullname,
        email,
        password,
        phone,
      });
      return persistUser(data.user, true);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
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
