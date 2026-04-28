import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

// AuthProvider lives in contexts/AuthProvider — re-exported here for convenience
export { AuthProvider } from '../contexts/AuthProvider';

// useAuth hook — imported by all consumer components via @/hooks/useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
