import React, { createContext, useState, useContext, useEffect } from "react";

import { login as apiLogin, register as apiRegister } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth hafızası okunurken hata:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Giriş Yapma Fonksiyonu
  const loginUser = async (credentials) => {
    try {
      const response = await apiLogin(credentials);

      const { token, email, rol } = response.data;

      setToken(token);
      setUser({ email: email, role: rol });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email: email, role: rol }));

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userInfo) => {
    try {
      const response = await apiRegister(userInfo);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Çıkış Yapma Fonksiyonu
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    loginUser,
    register,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Hook'u Oluştur
export const useAuth = () => {
  return useContext(AuthContext);
};
