import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken  , isLoading} = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!accessToken) return <Navigate to="/authpage" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;