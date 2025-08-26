import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { AuthContext } from "./authContext";

// ✅ export the context so `useAuth.js` can consume it

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Handle Login
  const login = async (formData) => {
    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Login",
        formData
      );

      const { token, expiresIn } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", expiresIn);

      const decoded = jwtDecode(token);
      setUserData(decoded);
      setToken(token);

      localStorage.setItem("userData", JSON.stringify(decoded));
      setLoginSuccess(true);
      toast.success("🎉 Logged in successfully");
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || "Error"));
      setLoginSuccess(false);
    }
  };

  // ✅ Handle Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("userData");
    setUserData(null);
    setToken(null);
    setLoginSuccess(false);
    toast.info("👋 Logged out");
  };

  // ✅ Restore user on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setUserData(decoded);
        setToken(savedToken);
        setLoginSuccess(true);
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData, login, logout, token, loginSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};
