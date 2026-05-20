import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ResetPasswordFunc } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const { setAccessToken } = useAuth();

  const handleSubmit = async () => {
    if (!newPassword) {
      Swal.fire({
        title: "Please Fill the input!",
        icon: "warning",
        draggable: true,
      });
      return;
    }

    try {
      const data = await ResetPasswordFunc(newPassword);
      setAccessToken(data.accessToken);
      navigate("/dashboardpage");
    } catch (error : any) {
      setError(error.message)
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-200 rounded-2xl p-10 w-105 flex flex-col gap-5">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-800">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full bg-white rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!newPassword}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-full transition-colors duration-200"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
