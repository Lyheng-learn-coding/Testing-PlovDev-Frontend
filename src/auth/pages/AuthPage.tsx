import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import {
  handleGoogleLoginOrSignup,
  LogIn,
  SignUp,
} from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

const AuthForm = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    try {
      setError("");
      setLoading(true);
      const user = await SignUp({ fullName, email, password });

      setTimeout(() => {
        navigate("/otppage", { state: { userId: user.userId } });
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Sign up failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await LogIn({ email, password });
      setAccessToken(data.accessToken); // save in memory

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Sign in failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isSignUp) {
      handleSignup();
    } else {
      handleSignIn();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4">
        <div className="w-full max-w-md bg-[#D9D9D9] rounded-xl p-8 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex bg-white rounded-full p-1 mb-10 shadow-inner">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                !isSignUp ? "bg-white shadow-md text-black" : "text-gray-500"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                isSignUp ? "bg-white shadow-md text-black" : "text-gray-500"
              }`}
            >
              Sign Up Free
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">
              {isSignUp ? "Create Your Account" : "Welcome back"}
            </h1>
            <p className="text-gray-600 text-sm">
              {isSignUp
                ? "Fill in your details to get started."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Full Name - signup only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg bg-white border-none focus:ring-2 focus:ring-yellow-400 outline-none placeholder:text-gray-300"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white border-none focus:ring-2 focus:ring-yellow-400 outline-none placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-black">
                  Password
                </label>
                {!isSignUp && (
                  <Link
                     to = "/forgotpassword"
                    className="text-xs font-bold text-orange-500 hover:underline"
                  >
                      Forgot password?
                  </Link>

                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-white border-none focus:ring-2 focus:ring-yellow-400 outline-none placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800"
                >
                  {showPassword ? (
                    <EyeIcon size={20} />
                  ) : (
                    <EyeOffIcon size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="grow border-t border-gray-400"></div>
              <span className="px-3 text-xs text-gray-500">
                or continue with
              </span>
              <div className="grow border-t border-gray-400"></div>
            </div>

            {/* Google Button */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={handleGoogleLoginOrSignup}
                className="flex-1 bg-white p-3 rounded-lg flex justify-center items-center hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                  alt="Google"
                  className="w-6 h-6"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#FFD700] hover:bg-[#F0C800] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              {!loading && <span className="text-lg">→</span>}
            </button>
          </div>

          {/* Footer Toggle */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-orange-500 font-bold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up free"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AuthForm;
