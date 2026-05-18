import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;

// GOOGLE LOGIN OR SIGN UP
export const handleGoogleLoginOrSignup = async () => {
  window.location.href = `${BASE_URL}/auth/google`;
};

// REFRESH TOKEN
export const handleRefreshToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refreshtoken`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }
    const data = await res.json();

    return data.accessToken ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// SIGN UP
export const SignUp = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    let userData = {
      fullName,
      email,
      password,
    };
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error("Failed to sign up");
    }
    const data = await res.json();

    toast("Sign up successful. Please check your email for OTP verification", {
      style: {
        background: "white",
        color: "black",
      },
    });

    console.log("sign up data:", data);
    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// LOGIN
export const LogIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    let userData = {
      email,
      password,
    };
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    console.log("data after login", data);

    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// VERIFY OTP CODE
export const verifyOtpCode = async ({
  userId,
  code,
}: {
  userId: number;
  code: number | string;
}) => {
  let userData = {
    userId,
    code,
  };
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// FORGOT PASSWORD

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// VERIFY FORGOT OTP
export const verifyForgotOtp = async ({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) => {
  let userData = {
    userId,
    code,
  };
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-forgot-otp`, {
      method: "POST",
      credentials : "include" ,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// RESET PASSWORD 
export const ResetPasswordFunc = async (newPassword : string) => {
  let userData = {
   newPassword
  };
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      credentials : "include" ,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    return data ?? [];
  } catch (error: any) {
    throw new Error(error);
  }
};

// LOGOUT
export const logOut = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("logout failed!");
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
