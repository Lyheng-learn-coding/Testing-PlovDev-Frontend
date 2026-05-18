import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { forgotPassword } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    if (!email) {
        Swal.fire({
            title: "Please Fill the input!",
            icon: "warning",
            draggable: true,
        });
        return;
    }

    const data = await forgotPassword(email);

    navigate("/otppage" , {state : {userId : data.userId , isForgotPassword: true}})
    console.log("Sending reset link to:", email);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-200 rounded-2xl p-10 w-95 flex flex-col gap-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            You can reset password here
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-800">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your email"
            className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleSubmit}
          disabled={!email}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-full transition-colors duration-200"
        >
          Reset Password
        </button>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500">
          Remember Password?{" "}
          <Link
            to="/authpage"
            className="text-orange-400 hover:text-orange-500 font-semibold transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
