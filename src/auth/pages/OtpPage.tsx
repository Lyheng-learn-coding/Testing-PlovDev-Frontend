import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyForgotOtp, verifyOtpCode } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { setAccessToken } = useAuth();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    // Auto-focus next
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
    const updated = ["", "", "", ""];
    pasted.forEach((char, i) => {
      if (/^\d$/.test(char)) updated[i] = char;
    });
    setOtp(updated);
    inputs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const handleVerify = async () => {
    const userId = location.state?.userId;
    const isForgotPassword = location.state?.isForgotPassword;
    const code = otp.join("");

    if (isForgotPassword) {
      // Forgot password flow
      await verifyForgotOtp({ userId, code });
      navigate("/resetpassword");
    } else {
      // Register flow
      const data = await verifyOtpCode({ userId, code });
      setAccessToken(data.accessToken);
      navigate("/dashboardpage");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();
    // TODO: call your resend API here
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-200 rounded-2xl p-10 w-[420px] flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-gray-500 text-sm mt-1">
            We have sent a verification code to your email
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex items-center gap-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-16 h-16 text-center text-xl font-semibold bg-white rounded-2xl outline-none shadow-sm text-gray-800 focus:ring-2 focus:ring-yellow-400 transition"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={otp.join("").length < 4}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-full transition-colors duration-200"
        >
          Verify
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            className="text-orange-400 hover:text-orange-500 font-semibold text-sm mt-1 transition-colors duration-200"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}
