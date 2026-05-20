import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { handleRefreshToken } from "./auth/services/auth.service";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent = () => {
  const { setAccessToken, setIsLoading } = useAuth();

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
  }, [setAccessToken, setIsLoading]);

  return <AppRouter />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
