import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading : boolean ;
  setIsLoading : (isLoading : boolean) => void
}

// Create context with type
const AuthContext = createContext<AuthContextType | null>(null);

// take token from user
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken , ] = useState<string | null>(null);
  const [isLoading , setIsLoading] = useState<boolean>(true)

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken  , isLoading , setIsLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with null check
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};