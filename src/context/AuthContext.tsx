import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, TreatmentPrefix } from '../types/user';

const users: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Usuário Comum' },
];

const AUTH_KEY = '@taskapp:auth';
const TREATMENT_KEY = '@taskapp:treatment';

interface AuthContextData {
  user: User | null;
  treatment: TreatmentPrefix;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logout: () => Promise<void>;
  setTreatment: (t: TreatmentPrefix) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [treatment, setTreatmentState] = useState<TreatmentPrefix>('Sr.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const [storedUser, storedTreatment] = await Promise.all([
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(TREATMENT_KEY),
        ]);
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        }
        if (storedTreatment === 'Sr.' || storedTreatment === 'Sra.' || storedTreatment === 'Srta.') {
          setTreatmentState(storedTreatment);
        }
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (username: string, password: string) => {
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) {
      return { success: false, error: 'Usuário ou senha inválidos.' };
    }
    setUser(found);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found));
    return { success: true, role: found.role };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.multiRemove([AUTH_KEY]);
  };

  const setTreatment = async (t: TreatmentPrefix) => {
    setTreatmentState(t);
    await AsyncStorage.setItem(TREATMENT_KEY, t);
  };

  return (
    <AuthContext.Provider value={{ user, treatment, isLoading, login, logout, setTreatment }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
