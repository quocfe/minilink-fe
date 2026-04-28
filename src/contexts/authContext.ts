import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

// Shared context — imported by both AuthProvider and useAuth hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

