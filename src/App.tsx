import { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { handleRefreshToken } from "./auth/services/auth.service";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";

const AppContent = () => {
  const { accessToken, setAccessToken, setIsLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check token from URL (Google OAuth)
        const token = new URLSearchParams(window.location.search).get("token");

        if (token) {
          setAccessToken(token);
          window.history.replaceState({}, "", "/"); // clean URL
        } else {
          // Normal page load → silent refresh
          const newToken = await handleRefreshToken();
          setAccessToken(newToken);
        }
      } catch {
        // No valid token, stay as guest
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return <AppRouter />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
